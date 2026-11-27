import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient, Role, OrderStatus } from "@prisma/client";
import { Redis } from "ioredis";
import { z } from "zod";

const app = express();
const db = new PrismaClient();
const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL, {lazyConnect:true, maxRetriesPerRequest:1}) : null;
redis?.connect().catch(()=>console.warn("Redis unavailable; using database-backed cart."));
app.use(helmet());
app.use(cors({origin:process.env.CLIENT_URL || "http://localhost:5173"}));
app.use(express.json({limit:"2mb"}));
app.use(rateLimit({windowMs:15*60*1000,limit:300}));
const secret = process.env.JWT_SECRET || "local-development-secret-change-me";
type AuthReq = express.Request & { user?: {id:string;role:Role;email:string} };
const auth = async (req:AuthReq,res:express.Response,next:express.NextFunction) => {
  try {
    const token = (req.headers.authorization || "").replace(/^Bearer\s+/,"");
    const payload = jwt.verify(token,secret) as {id:string;role:Role;email:string};
    req.user = payload; next();
  } catch { res.status(401).json({error:"Authentication required"}); }
};
const allow = (...roles:Role[]) => (req:AuthReq,res:express.Response,next:express.NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({error:"Insufficient permissions"});
  next();
};
app.get("/api/health",(_,res)=>res.json({status:"ok",service:"marketplace-api"}));

app.post("/api/auth/register",async(req,res)=>{
  const parsed=z.object({name:z.string().min(2),email:z.string().email(),password:z.string().min(8),role:z.enum(["CUSTOMER","VENDOR"]).default("CUSTOMER")}).safeParse(req.body);
  if(!parsed.success) return res.status(400).json({error:parsed.error.flatten()});
  try {
    const password=await bcrypt.hash(parsed.data.password,10);
    const user=await db.user.create({data:{...parsed.data,password,role:parsed.data.role as Role}});
    const token=jwt.sign({id:user.id,role:user.role,email:user.email},secret,{expiresIn:"7d"});
    res.status(201).json({token,user:{id:user.id,name:user.name,email:user.email,role:user.role}});
  } catch { res.status(409).json({error:"Email is already registered"}); }
});
app.post("/api/auth/login",async(req,res)=>{
  const parsed=z.object({email:z.string().email(),password:z.string()}).safeParse(req.body);
  if(!parsed.success) return res.status(400).json({error:"Valid email and password are required"});
  const user=await db.user.findUnique({where:{email:parsed.data.email}});
  if(!user || !(await bcrypt.compare(parsed.data.password,user.password))) return res.status(401).json({error:"Invalid credentials"});
  const token=jwt.sign({id:user.id,role:user.role,email:user.email},secret,{expiresIn:"7d"});
  res.json({token,user:{id:user.id,name:user.name,email:user.email,role:user.role,vendorApproved:user.vendorApproved}});
});
app.get("/api/auth/me",auth,async(req:AuthReq,res)=>res.json(await db.user.findUnique({where:{id:req.user!.id},select:{id:true,name:true,email:true,role:true,vendorApproved:true}})));

app.post("/api/vendors/apply",auth,async(req:AuthReq,res)=>{
  if(req.user!.role!==Role.CUSTOMER && req.user!.role!==Role.VENDOR) return res.status(403).json({error:"Not allowed"});
  const user=await db.user.update({where:{id:req.user!.id},data:{role:Role.VENDOR,vendorApproved:false}});
  res.json({message:"Vendor application submitted",status:user.vendorApproved?"approved":"pending"});
});
app.get("/api/products",async(req,res)=>{
  const q=String(req.query.q||""); const category=String(req.query.category||"");
  const sort=String(req.query.sort||"newest");
  const orderBy:any=sort==="price_asc"?{price:"asc"}:sort==="price_desc"?{price:"desc"}:{createdAt:"desc"};
  const products=await db.product.findMany({where:{active:true,...(q?{OR:[{name:{contains:q,mode:"insensitive"}},{description:{contains:q,mode:"insensitive"}}]}:{}),...(category?{category}:{})},include:{vendor:{select:{name:true}}},orderBy});
  res.json(products);
});
app.post("/api/products",auth,allow(Role.VENDOR,Role.ADMIN),async(req:AuthReq,res)=>{
  const parsed=z.object({name:z.string().min(2),description:z.string(),price:z.coerce.number().positive(),stock:z.coerce.number().int().min(0),category:z.string().min(2),imageUrl:z.string().url().optional()}).safeParse(req.body);
  if(!parsed.success)return res.status(400).json({error:parsed.error.flatten()});
  if(req.user!.role===Role.VENDOR){const u=await db.user.findUnique({where:{id:req.user!.id}});if(!u?.vendorApproved)return res.status(403).json({error:"Vendor approval pending"});}
  const product=await db.product.create({data:{...parsed.data,vendorId:req.user!.role===Role.ADMIN?req.body.vendorId||req.user!.id:req.user!.id}});
  res.status(201).json(product);
});
app.put("/api/products/:id",auth,allow(Role.VENDOR,Role.ADMIN),async(req:AuthReq,res)=>{
  const product=await db.product.findUnique({where:{id:req.params.id}});
  if(!product)return res.status(404).json({error:"Product not found"});
  if(req.user!.role!==Role.ADMIN && product.vendorId!==req.user!.id)return res.status(403).json({error:"Not your product"});
  const updated=await db.product.update({where:{id:product.id},data:req.body});res.json(updated);
});
app.delete("/api/products/:id",auth,allow(Role.VENDOR,Role.ADMIN),async(req:AuthReq,res)=>{
  const product=await db.product.findUnique({where:{id:req.params.id}});
  if(!product)return res.status(404).json({error:"Product not found"});
  if(req.user!.role!==Role.ADMIN && product.vendorId!==req.user!.id)return res.status(403).json({error:"Not your product"});
  await db.product.update({where:{id:product.id},data:{active:false}});res.json({message:"Product archived"});
});
app.post("/api/cart",auth,async(req:AuthReq,res)=>{
  const parsed=z.object({productId:z.string(),quantity:z.number().int().min(1).max(50)}).safeParse(req.body);
  if(!parsed.success)return res.status(400).json({error:"Invalid cart item"});
  const product=await db.product.findUnique({where:{id:parsed.data.productId}});
  if(!product||!product.active||product.stock<parsed.data.quantity)return res.status(400).json({error:"Product unavailable or insufficient stock"});
  const key=`cart:${req.user!.id}`; let cart:any[]=[];
  if(redis){try{cart=JSON.parse((await redis.get(key))||"[]");}catch{}}
  const existing=cart.find(x=>x.productId===product.id);
  if(existing)existing.quantity=parsed.data.quantity;else cart.push(parsed.data);
  if(redis)await redis.set(key,JSON.stringify(cart),"EX",86400);
  res.json({items:cart});
});
app.get("/api/cart",auth,async(req:AuthReq,res)=>{
  let items:any[]=[];if(redis){try{items=JSON.parse((await redis.get(`cart:${req.user!.id}`))||"[]");}catch{}}
  const hydrated=await Promise.all(items.map(async i=>({...(await db.product.findUnique({where:{id:i.productId}})),quantity:i.quantity})));
  res.json(hydrated.filter(Boolean));
});
app.post("/api/checkout",auth,async(req:AuthReq,res)=>{
  let items:any[]=[];if(redis){try{items=JSON.parse((await redis.get(`cart:${req.user!.id}`))||"[]");}catch{}}
  if(!items.length)return res.status(400).json({error:"Cart is empty"});
  try{
    const order=await db.$transaction(async tx=>{
      const products=await Promise.all(items.map(i=>tx.product.findUnique({where:{id:i.productId}})));
      if(products.some((p,i)=>!p||p.stock<items[i].quantity||!p.active))throw new Error("Stock changed; refresh your cart");
      const subtotal=products.reduce((s,p,i)=>s+Number(p!.price)*items[i].quantity,0);
      const commission=Number((subtotal*Number(process.env.PLATFORM_COMMISSION_PERCENT||10)/100).toFixed(2));
      const created=await tx.order.create({data:{buyerId:req.user!.id,subtotal,commission,total:subtotal, paymentReference:`TEST_${Date.now()}`,items:{create:products.map((p,i)=>({productId:p!.id,productName:p!.name,vendorId:p!.vendorId,quantity:items[i].quantity,unitPrice:p!.price}))}},include:{items:true}});
      for(let i=0;i<products.length;i++)await tx.product.update({where:{id:products[i]!.id},data:{stock:{decrement:items[i].quantity}}});
      return created;
    });
    if(redis)await redis.del(`cart:${req.user!.id}`);
    res.status(201).json({order,payment:{mode:"test",status:"authorized",reference:order.paymentReference},message:"Test checkout completed. No real money was charged."});
  }catch(e:any){res.status(400).json({error:e.message||"Checkout failed"});}
});
app.get("/api/orders",auth,async(req:AuthReq,res)=>{
  const where:any=req.user!.role===Role.ADMIN?{}:{buyerId:req.user!.id};
  res.json(await db.order.findMany({where,include:{items:true},orderBy:{createdAt:"desc"}}));
});
app.patch("/api/orders/:id/status",auth,allow(Role.ADMIN,Role.VENDOR),async(req:AuthReq,res)=>{
  const parsed=z.enum(["PLACED","PACKED","SHIPPED","DELIVERED","CANCELLED"]).safeParse(req.body.status);
  if(!parsed.success)return res.status(400).json({error:"Invalid order status"});
  const order=await db.order.findUnique({where:{id:req.params.id},include:{items:true}});
  if(!order)return res.status(404).json({error:"Order not found"});
  if(req.user!.role===Role.VENDOR&&!order.items.some(i=>i.vendorId===req.user!.id))return res.status(403).json({error:"Not your order"});
  res.json(await db.order.update({where:{id:order.id},data:{status:parsed.data as OrderStatus}}));
});
app.post("/api/products/:id/reviews",auth,async(req:AuthReq,res)=>{
  const parsed=z.object({rating:z.number().int().min(1).max(5),comment:z.string().min(2).max(1000)}).safeParse(req.body);
  if(!parsed.success)return res.status(400).json({error:"Rating (1-5) and comment required"});
  const product=await db.product.findUnique({where:{id:req.params.id}});if(!product)return res.status(404).json({error:"Product not found"});
  res.status(201).json(await db.review.create({data:{...parsed.data,userId:req.user!.id,productId:product.id}}));
});
app.post("/api/coupons/validate",async(req,res)=>{
  const coupon=await db.coupon.findUnique({where:{code:String(req.body.code||"").toUpperCase()}});
  if(!coupon||!coupon.active||(coupon.expiresAt&&coupon.expiresAt<new Date()))return res.status(404).json({error:"Coupon invalid or expired"});
  res.json({code:coupon.code,discountPercent:coupon.discountPercent});
});
app.get("/api/admin/analytics",auth,allow(Role.ADMIN),async(_,res)=>{
  const [users,products,orders,revenue]=await Promise.all([db.user.count(),db.product.count({where:{active:true}}),db.order.count(),db.order.aggregate({ _sum:{total:true,commission:true} })]);
  res.json({users,products,orders,revenue:Number(revenue._sum.total||0),commission:Number(revenue._sum.commission||0)});
});
app.get("/api/orders/:id/invoice",auth,async(req:AuthReq,res)=>{
  const order=await db.order.findUnique({where:{id:req.params.id},include:{items:true}});
  if(!order)return res.status(404).json({error:"Order not found"});
  if(req.user!.role!==Role.ADMIN&&order.buyerId!==req.user!.id)return res.status(403).json({error:"Not your invoice"});
  res.type("text/html").send(`<html><body><h1>Marketplace Invoice</h1><p>Order: ${order.id}</p><p>Status: ${order.status}</p><ul>${order.items.map(i=>`<li>${i.productName} × ${i.quantity} — ₹${Number(i.unitPrice)*i.quantity}</li>`).join("")}</ul><p>Subtotal: ₹${order.subtotal}</p><p>Platform commission (internal): ₹${order.commission}</p><h2>Total: ₹${order.total}</h2></body></html>`);
});
const port=Number(process.env.PORT||4000);
app.listen(port,()=>console.log(`Marketplace API listening on ${port}`));
