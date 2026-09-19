import { signToken, AUTH_COOKIE_NAME } from '../lib/auth'
import { prisma } from '../lib/prisma'

const BASE_URL = 'http://localhost:3000'

async function runTests() {
  console.log('=================================================================')
  console.log('🛡️ GAURAV NURSERY — COMPREHENSIVE SECURITY & /SHOP VERIFICATION')
  console.log('=================================================================\n')

  let passed = 0
  let failed = 0

  const assert = (condition: boolean, testName: string, detail?: string) => {
    if (condition) {
      console.log(`✅ PASS: ${testName}`)
      if (detail) console.log(`   └─ ${detail}`)
      passed++
    } else {
      console.error(`❌ FAIL: ${testName}`)
      if (detail) console.error(`   └─ ${detail}`)
      failed++
    }
  }

  // 1. Fetch seed users from database
  const adminUser = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } })
  const sellers = await prisma.sellerProfile.findMany({ include: { user: true } })
  const customerUser = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } })
  const deliveryUser = await prisma.user.findFirst({ where: { role: 'DELIVERY_PARTNER' } })

  if (!adminUser || sellers.length < 2 || !customerUser || !deliveryUser) {
    throw new Error('Seed data missing: Need admin, at least 2 sellers, customer, and delivery partner')
  }

  const seller1 = sellers[0]
  const seller2 = sellers[1]

  const adminToken = signToken({
    userId: adminUser.id,
    email: adminUser.email,
    name: adminUser.name,
    role: 'SUPER_ADMIN',
  })

  const seller1Token = signToken({
    userId: seller1.userId,
    email: seller1.user.email,
    name: seller1.user.name,
    role: 'SELLER',
    sellerId: seller1.id,
  })

  const seller2Token = signToken({
    userId: seller2.userId,
    email: seller2.user.email,
    name: seller2.user.name,
    role: 'SELLER',
    sellerId: seller2.id,
  })

  const customerToken = signToken({
    userId: customerUser.id,
    email: customerUser.email,
    name: customerUser.name,
    role: 'CUSTOMER',
  })

  const deliveryToken = signToken({
    userId: deliveryUser.id,
    email: deliveryUser.email,
    name: deliveryUser.name,
    role: 'DELIVERY_PARTNER',
  })

  console.log('▶ CHECK 1: Incognito / Unauthenticated Portal Access')
  {
    // Incognito /admin
    const resAdmin = await fetch(`${BASE_URL}/admin`, { redirect: 'manual' })
    const locAdmin = resAdmin.headers.get('location') || ''
    assert(
      resAdmin.status === 307 || resAdmin.status === 302 || locAdmin.includes('/login'),
      'Incognito /admin is denied',
      `Status: ${resAdmin.status}, Redirect: ${locAdmin}`
    )

    // Incognito /seller/dashboard
    const resSeller = await fetch(`${BASE_URL}/seller/dashboard`, { redirect: 'manual' })
    const locSeller = resSeller.headers.get('location') || ''
    assert(
      resSeller.status === 307 || resSeller.status === 302 || locSeller.includes('/login'),
      'Incognito /seller/dashboard is denied',
      `Status: ${resSeller.status}, Redirect: ${locSeller}`
    )

    // Incognito /delivery
    const resDelivery = await fetch(`${BASE_URL}/delivery`, { redirect: 'manual' })
    const locDelivery = resDelivery.headers.get('location') || ''
    assert(
      resDelivery.status === 307 || resDelivery.status === 302 || locDelivery.includes('/login'),
      'Incognito /delivery is denied',
      `Status: ${resDelivery.status}, Redirect: ${locDelivery}`
    )
  }

  console.log('\n▶ CHECK 2: Role-Based Portal Access (Wrong Role Denied)')
  {
    // CUSTOMER -> /admin
    const resCustAdmin = await fetch(`${BASE_URL}/admin`, {
      headers: { Cookie: `${AUTH_COOKIE_NAME}=${customerToken}` },
      redirect: 'manual',
    })
    const locCustAdmin = resCustAdmin.headers.get('location') || ''
    assert(
      locCustAdmin.includes('forbidden') || locCustAdmin.includes('/login'),
      'CUSTOMER accessing /admin is denied',
      `Redirect: ${locCustAdmin}`
    )

    // SELLER -> /admin
    const resSellerAdmin = await fetch(`${BASE_URL}/admin`, {
      headers: { Cookie: `${AUTH_COOKIE_NAME}=${seller1Token}` },
      redirect: 'manual',
    })
    const locSellerAdmin = resSellerAdmin.headers.get('location') || ''
    assert(
      locSellerAdmin.includes('forbidden') || locSellerAdmin.includes('/login'),
      'SELLER accessing /admin is denied',
      `Redirect: ${locSellerAdmin}`
    )

    // DELIVERY_PARTNER -> /admin
    const resDeliveryAdmin = await fetch(`${BASE_URL}/admin`, {
      headers: { Cookie: `${AUTH_COOKIE_NAME}=${deliveryToken}` },
      redirect: 'manual',
    })
    const locDeliveryAdmin = resDeliveryAdmin.headers.get('location') || ''
    assert(
      locDeliveryAdmin.includes('forbidden') || locDeliveryAdmin.includes('/login'),
      'DELIVERY_PARTNER accessing /admin is denied',
      `Redirect: ${locDeliveryAdmin}`
    )
  }

  console.log('\n▶ CHECK 3: Authenticated Correct Role Access (Allowed)')
  {
    // SUPER_ADMIN -> /admin
    const resAdmin = await fetch(`${BASE_URL}/admin`, {
      headers: { Cookie: `${AUTH_COOKIE_NAME}=${adminToken}` },
    })
    assert(
      resAdmin.status === 200,
      'SUPER_ADMIN accessing /admin is allowed (200 OK)',
      `Status: ${resAdmin.status}`
    )

    // SELLER -> /seller/dashboard
    const resSeller = await fetch(`${BASE_URL}/seller/dashboard`, {
      headers: { Cookie: `${AUTH_COOKIE_NAME}=${seller1Token}` },
    })
    assert(
      resSeller.status === 200,
      'SELLER accessing /seller/dashboard is allowed (200 OK)',
      `Status: ${resSeller.status}`
    )

    // DELIVERY_PARTNER -> /delivery
    const resDelivery = await fetch(`${BASE_URL}/delivery`, {
      headers: { Cookie: `${AUTH_COOKIE_NAME}=${deliveryToken}` },
    })
    assert(
      resDelivery.status === 200,
      'DELIVERY_PARTNER accessing /delivery is allowed (200 OK)',
      `Status: ${resDelivery.status}`
    )
  }

  console.log('\n▶ CHECK 4: Direct Backend API Request Without Auth (401 Unauthorized)')
  {
    // GET /api/admin/metrics without auth
    const res1 = await fetch(`${BASE_URL}/api/admin/metrics`)
    assert(
      res1.status === 401,
      'GET /api/admin/metrics without auth returns 401',
      `Status: ${res1.status}`
    )

    // GET /api/admin/commission without auth
    const res2 = await fetch(`${BASE_URL}/api/admin/commission`)
    assert(
      res2.status === 401,
      'GET /api/admin/commission without auth returns 401 (no bank details leak)',
      `Status: ${res2.status}`
    )

    // GET /api/seller/orders without auth
    const res3 = await fetch(`${BASE_URL}/api/seller/orders`)
    assert(
      res3.status === 401,
      'GET /api/seller/orders without auth returns 401 (no fallback to first seller)',
      `Status: ${res3.status}`
    )

    // GET /api/delivery without auth
    const res4 = await fetch(`${BASE_URL}/api/delivery`)
    assert(
      res4.status === 401,
      'GET /api/delivery without auth returns 401',
      `Status: ${res4.status}`
    )
  }

  console.log('\n▶ CHECK 5: Direct Backend API Request With Wrong Role (403 Forbidden)')
  {
    // Customer calling /api/admin/metrics
    const resCust = await fetch(`${BASE_URL}/api/admin/metrics`, {
      headers: { Cookie: `${AUTH_COOKIE_NAME}=${customerToken}` },
    })
    assert(
      resCust.status === 403,
      'CUSTOMER calling /api/admin/metrics returns 403 Forbidden',
      `Status: ${resCust.status}`
    )

    // Seller calling /api/admin/metrics
    const resSeller = await fetch(`${BASE_URL}/api/admin/metrics`, {
      headers: { Cookie: `${AUTH_COOKIE_NAME}=${seller1Token}` },
    })
    assert(
      resSeller.status === 403,
      'SELLER calling /api/admin/metrics returns 403 Forbidden',
      `Status: ${resSeller.status}`
    )

    // Customer calling /api/seller/orders
    const resCustSeller = await fetch(`${BASE_URL}/api/seller/orders`, {
      headers: { Cookie: `${AUTH_COOKIE_NAME}=${customerToken}` },
    })
    assert(
      resCustSeller.status === 403,
      'CUSTOMER calling /api/seller/orders returns 403 Forbidden',
      `Status: ${resCustSeller.status}`
    )
  }

  console.log("\n▶ CHECK 6: Seller Cross-Tenant Isolation (Seller 1 cannot access Seller 2's data)")
  {
    // Seller 1 tries to query Seller 2's orders
    const resCrossOrders = await fetch(`${BASE_URL}/api/seller/orders?sellerId=${seller2.id}`, {
      headers: { Cookie: `${AUTH_COOKIE_NAME}=${seller1Token}` },
    })
    assert(
      resCrossOrders.status === 403,
      "Seller 1 requesting Seller 2's orders returns 403 Forbidden",
      `Status: ${resCrossOrders.status}`
    )

    // Seller 1 tries to query Seller 2's payouts
    const resCrossPayouts = await fetch(`${BASE_URL}/api/seller/payouts?sellerId=${seller2.id}`, {
      headers: { Cookie: `${AUTH_COOKIE_NAME}=${seller1Token}` },
    })
    assert(
      resCrossPayouts.status === 403,
      "Seller 1 requesting Seller 2's payouts returns 403 Forbidden",
      `Status: ${resCrossPayouts.status}`
    )

    // Seller 1 tries to query Seller 2's products
    const resCrossProducts = await fetch(`${BASE_URL}/api/seller/products?sellerId=${seller2.id}`, {
      headers: { Cookie: `${AUTH_COOKIE_NAME}=${seller1Token}` },
    })
    assert(
      resCrossProducts.status === 403,
      "Seller 1 requesting Seller 2's products returns 403 Forbidden",
      `Status: ${resCrossProducts.status}`
    )
  }

  console.log('\n▶ CHECK 7: /shop Pre-Rendering & Instant Live Products')
  {
    const resShop = await fetch(`${BASE_URL}/shop`)
    const shopHtml = await resShop.text()

    assert(
      resShop.status === 200,
      '/shop returns HTTP 200',
      `Status: ${resShop.status}`
    )

    // Should NOT contain the old loading placeholder
    const hasLoading = shopHtml.includes('Loading fresh nursery plants...')
    assert(
      !hasLoading,
      '/shop initial HTML does NOT contain "Loading fresh nursery plants..." spinner',
      `Loading spinner in HTML: ${hasLoading}`
    )

    // Should contain live products in the HTML directly
    const hasAdenium = shopHtml.includes('Adenium') || shopHtml.includes('Snake Plant') || shopHtml.includes('Peace Lily')
    assert(
      hasAdenium,
      '/shop initial HTML contains live approved products directly pre-rendered from server',
      `Live plant title found in HTML: ${hasAdenium}`
    )

    // Should have accurate item count badge (not 0)
    const hasZeroBadge = shopHtml.includes('>0 Items Available<')
    assert(
      !hasZeroBadge,
      '/shop initial HTML item count badge does NOT say 0 Items Available',
      `0 Items badge present: ${hasZeroBadge}`
    )
  }

  console.log('\n=================================================================')
  console.log(`🏁 VERIFICATION RESULT: ${passed} PASSED, ${failed} FAILED`)
  console.log('=================================================================')

  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err)
  process.exit(1)
})
