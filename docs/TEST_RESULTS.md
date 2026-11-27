# Test Results & Evaluation Checklist

## Status policy
This report deliberately separates deployed service status from functional test results. A successful Render deploy is not proof that every business flow works.

| Check | Evidence / expected result | Status |
|---|---|---|
| FS-01 static site deploy | Render service reports Deployed | Deployed (service-level) |
| FS-02 static site deploy | Render service reports Deployed | Deployed (service-level) |
| FS-02 REST API deploy | Render service reports Deployed | Deployed (service-level) |
| FS-02 Yjs service deploy | Render service reports Deployed | Deployed (service-level) |
| FS-01 REST API build | Earlier TypeScript build failed on Redis import; import fix committed; verify latest deployment | Pending verification |
| FS-01 database connectivity | Register/login and health endpoint against live DB | Not yet manually verified |
| Customer/vendor/admin authorization | Attempt allowed and forbidden operations for each role | Not yet manually verified |
| Product CRUD/cart/order | Create product, add to cart, place order, verify DB records | Not yet manually verified |
| Collaborative editing | Two browsers edit same document simultaneously; verify convergence | Not yet manually verified |
| Reconnect/persistence | Refresh/reconnect and confirm expected document state | Not yet manually verified |
| Load/performance | Record repeatable test tool, concurrency, latency percentiles and environment | Not measured |

## Manual smoke-test plan
1. Open both frontend URLs in an incognito browser.
2. Check browser console and network tab for failed API requests/CORS errors.
3. Register a test customer; log out and log in.
4. For FS-01, test vendor onboarding/product create, customer product browse/cart/order and role restrictions.
5. For FS-02, create a workspace/document, open it in two separate browsers and type concurrently.
6. Save screenshots or a screen recording only after the corresponding flow succeeds.

**Do not report pass rates, performance numbers, payment settlement, or durable persistence until actually tested.**
