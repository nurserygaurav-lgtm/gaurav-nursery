# 🌱 Gaurav Nursery — Specialized Multi-Vendor Plant Marketplace (Phase 1 MVP)

> India's premier multi-vendor plant and gardening supplies marketplace built with Next.js 14, TypeScript, Tailwind CSS, and Prisma ORM. Connects verified local nurseries directly with customers, featuring a **10% transparent platform commission engine**, specialized plant care specifications, and centralized Super Admin controls.

---

## 👑 4 Specialized Portals

| Portal | URL Route | Target Persona | Key Features |
| :--- | :--- | :--- | :--- |
| **👑 Super Admin** | `/admin` | Marketplace Owner / Operator | Seller KYC approvals, Product catalog moderation, 10% Commission ledger audit, Bank payouts settlement |
| **🏪 Seller Portal** | `/seller/dashboard` | Partner Nurseries | Nursery onboarding & KYC, Specialized plant listing (Sunlight, Water, Pot specs), Isolated order fulfillment, 10% commission statement |
| **🛒 Customer Storefront** | `/` | Home Gardeners & Plant Lovers | Sunlight & watering schedule filters, Multi-vendor basket, Split-order checkout, Live transit tracking |
| **🚚 Delivery Partner** | `/delivery` | Dispatch Logistics | Live plant dispatch queue, Nursery pickup address, Customer drop address, Status progression (`Delivered` unlocks payout) |

---

## 🔑 Demo Access & Seed Credentials

The database comes pre-seeded with realistic nurseries, plants, and multi-vendor split orders:

| Role | Email | Password | Pre-seeded Profile Details |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@gauravnursery.com` | `admin123` | Platform Superuser (Full access to `/admin`) |
| **Approved Seller 1** | `gaurav@greennursery.com` | `seller123` | **Gaurav Greenery Hub** (Surat) — Status: `ACTIVE` |
| **Approved Seller 2** | `raj@floranursery.com` | `seller123` | **Shree Ram Plant Nursery** (Ahmedabad) — Status: `ACTIVE` |
| **Pending Seller 3** | `fresh@flora.com` | `seller123` | **Fresh Flora Nursery** (Vadodara) — Status: `KYC_PENDING` (Awaiting Admin review) |
| **Customer User** | `customer@gmail.com` | `customer123` | Anjali Mehta (Surat, Gujarat) |
| **Delivery Rider** | `delivery@gauravnursery.com` | `delivery123` | Ramesh Rider (Express Live Plant Transit) |

---

## 💰 10% Commission & Multi-Vendor Splitting Mechanics

### Order Splitting Example:
When a customer adds plants from multiple nurseries into a single cart:
- **Adenium Desert Rose** from *Gaurav Greenery Hub* = ₹499
- **Ginseng Bonsai** from *Shree Ram Plant Nursery* = ₹899
- **Gross Order Total** = **₹1,398.00**

### Backend Execution:
1. **Master Order** (`GN-2026-1001`): Total ₹1,398.00
2. **Sub-Order A** (`GN-2026-1001-A`): 
   - Seller: Gaurav Greenery Hub
   - Gross Amount: ₹499.00
   - Platform Commission (10%): **₹49.90**
   - Seller Net Payable (90%): **₹449.10**
3. **Sub-Order B** (`GN-2026-1001-B`): 
   - Seller: Shree Ram Plant Nursery
   - Gross Amount: ₹899.00
   - Platform Commission (10%): **₹89.90**
   - Seller Net Payable (90%): **₹809.10**
4. **Immutable Commission Ledger**:
   - Total Platform Fee Collected: **₹139.80**
   - Immutable audit trail stored in `CommissionLedger` table.

---

## 🌿 Specialized Plant Specifications Engine
Unlike generic e-commerce clones, every plant in Gaurav Nursery tracks botanical care parameters:
- ☀️ **Sunlight Requirement**: `Low Light (Indoor)`, `Moderate Indirect`, `Full Sun (Outdoor)`
- 💧 **Watering Schedule**: `Low (Once a week)`, `Moderate (2-3 days)`, `High (Daily)`
- 📏 **Plant Height**: e.g., `10 - 14 inches`
- 🪴 **Pot Dimensions & Material**: e.g., `6 inch self-watering pot`, `Terracotta ribbed pot`
- 🌱 **Potting Soil Blend**: e.g., `Cocopeat + perlite + vermicompost`
- 🧗 **Difficulty Level**: `Beginner Friendly`, `Intermediate`, `Expert`

---

## 🚀 Quick Local Run Instructions

```bash
# 1. Install dependencies
npm install

# 2. Push Prisma database schema (SQLite in development, PostgreSQL-ready)
npx prisma db push

# 3. Seed demo nurseries, products, and commission ledgers
npm run seed

# 4. Start Next.js development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Production PostgreSQL Migration
To switch from local SQLite to production PostgreSQL:
1. In `prisma/schema.prisma`, change datasource provider from `"sqlite"` to `"postgresql"`.
2. In `.env`, set `DATABASE_URL="postgresql://user:password@host:5432/gauravnursery?schema=public"`.
3. Run `npx prisma db push`.
