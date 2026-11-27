import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
const db = new PrismaClient();
async function main() {
  const password = await bcrypt.hash("Password123!", 10);
  const admin = await db.user.upsert({where:{email:"admin@nexvia.local"},update:{},create:{name:"Marketplace Admin",email:"admin@nexvia.local",password,role:Role.ADMIN}});
  const vendor = await db.user.upsert({where:{email:"vendor@nexvia.local"},update:{},create:{name:"Demo Vendor",email:"vendor@nexvia.local",password,role:Role.VENDOR,vendorApproved:true}});
  await db.user.upsert({where:{email:"customer@nexvia.local"},update:{},create:{name:"Demo Customer",email:"customer@nexvia.local",password,role:Role.CUSTOMER}});
  const count = await db.product.count();
  if (!count) await db.product.createMany({data:[
    {name:"Wireless Headphones",description:"Comfortable over-ear headphones with clear sound.",price:2499,stock:25,category:"Electronics",vendorId:vendor.id},
    {name:"Everyday Backpack",description:"Durable backpack for work and travel.",price:1599,stock:40,category:"Accessories",vendorId:vendor.id},
    {name:"Desk Lamp",description:"Minimal LED desk lamp.",price:899,stock:30,category:"Home",vendorId:vendor.id}
  ]});
  await db.coupon.upsert({where:{code:"WELCOME10"},update:{},create:{code:"WELCOME10",discountPercent:10}});
  console.log("Seed complete", admin.email);
}
main().finally(()=>db.$disconnect());
