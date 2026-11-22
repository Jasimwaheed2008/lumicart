# LumiCart — Next.js + MongoDB e-commerce
## Setup
1. Requirements: Node 20+, a MongoDB instance (local or Atlas).
2. `npm install`
3. `cp .env.example .env.local`, then set `MONGODB_URI` and a long random `JWT_SECRET` (e.g. `openssl rand -hex 32`).
4. `npm run seed` — demo categories/products/coupons and two accounts:
   - admin: `admin@shop.test` / `Admin123!`  (admin panel at `/admin`)
   - customer: `demo@shop.test` / `Demo123!`
   Change these passwords (or delete the accounts) before any real deployment.
5. `npm run dev` → http://localhost:3000   ·   Production: `npm run build && npm start`
## Notes
- Payments: Cash on Delivery works. Online payment is intentionally rejected by the API until a gateway (e.g. Stripe) is integrated with webhook verification; only the webhook should set `paymentStatus: "paid"`.
- Password reset: the link is printed to the server console in development; connect an email provider for production.
- Rate limiting is in-memory (single instance); use Redis or an edge limiter when scaling out.
- Admin image URLs: `next.config.mjs` allows all https hosts; restrict for production.
- Privacy/Terms pages are templates — get legal review.
