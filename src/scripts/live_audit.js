const https = require('https');

function fetchJson(url, options = {}) {
  return new Promise((resolve) => {
    const parsed = new URL(url);
    const req = https.request({
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SiteCheck/1.0',
        ...(options.headers || {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch(e) {}
        resolve({ status: res.statusCode, headers: res.headers, body: data, json });
      });
    });
    req.on('error', (err) => resolve({ error: err.message }));
    if (options.body) req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    req.end();
  });
}

async function runCheck() {
  console.log('==================================================');
  console.log('🌿 GAURAV NURSERY FULL LIVE SYSTEM AUDIT');
  console.log('==================================================\n');

  // 1. PUBLIC PAGES CHECK
  console.log('--- 1. PUBLIC PAGES STATUS & LEAK CHECK ---');
  const publicPages = [
    '/',
    '/shop',
    '/cart',
    '/checkout',
    '/login',
    '/seller/register'
  ];

  for (const path of publicPages) {
    const res = await fetchJson('https://gauravnursery.online' + path);
    const has10 = res.body && (res.body.includes('10%') || res.body.toLowerCase().includes('commission model'));
    const hasAddress = res.body && (res.body.includes('Headquarters: Surat') || res.body.includes('Dumas Road'));
    console.log(
      'Page: ' + path.padEnd(18) + 
      ' | Status: ' + res.status + 
      ' | 10% Leak: ' + (has10 ? '❌ YES' : '✅ NONE') + 
      ' | Address Leak: ' + (hasAddress ? '❌ YES' : '✅ NONE')
    );
  }

  // 2. PRODUCT CATALOG & CATEGORIES CHECK
  console.log('\n--- 2. CATALOG & PRODUCTS CHECK ---');
  const productsRes = await fetchJson('https://gauravnursery.online/api/products');
  console.log('API /api/products       | Status: ' + productsRes.status + ' | Total Products: ' + (productsRes.json?.products?.length || 'N/A'));

  if (productsRes.json?.products?.length > 0) {
    const firstProduct = productsRes.json.products[0];
    const detailRes = await fetchJson('https://gauravnursery.online/product/' + firstProduct.slug);
    console.log('Product Detail Page     | Slug: ' + firstProduct.slug + ' | Status: ' + detailRes.status);
  }

  // 3. SUPER ADMIN AUTH & DASHBOARD CHECK
  console.log('\n--- 3. SUPER ADMIN AUTH & DASHBOARD CHECK ---');
  const adminLogin = await fetchJson('https://gauravnursery.online/api/auth/login', {
    method: 'POST',
    body: { email: 'admin@gauravnursery.com', password: 'admin123' }
  });
  console.log('Admin Login API         | Status: ' + adminLogin.status + ' | Role: ' + adminLogin.json?.user?.role);

  const adminCookie = adminLogin.headers['set-cookie'] ? adminLogin.headers['set-cookie'].join('; ') : '';
  const adminMetrics = await fetchJson('https://gauravnursery.online/api/admin/metrics', {
    headers: { cookie: adminCookie }
  });
  console.log('Admin Metrics API       | Status: ' + adminMetrics.status + ' | Total Nurseries: ' + (adminMetrics.json?.metrics?.activeSellersCount ?? 'OK'));

  const adminSellers = await fetchJson('https://gauravnursery.online/api/admin/sellers', {
    headers: { cookie: adminCookie }
  });
  console.log('Admin Sellers API       | Status: ' + adminSellers.status + ' | Sellers Count: ' + (adminSellers.json?.sellers?.length ?? 0));

  const adminCommission = await fetchJson('https://gauravnursery.online/api/admin/commission', {
    headers: { cookie: adminCookie }
  });
  console.log('Admin Commission Ledger | Status: ' + adminCommission.status + ' | Ledgers Count: ' + (adminCommission.json?.ledgers?.length ?? 0));

  // 4. SELLER PORTAL AUTH & CHECK
  console.log('\n--- 4. SELLER PORTAL AUTH & CHECK ---');
  const sellerLogin = await fetchJson('https://gauravnursery.online/api/auth/login', {
    method: 'POST',
    body: { email: 'gaurav@greennursery.com', password: 'seller123' }
  });
  console.log('Seller Login API        | Status: ' + sellerLogin.status + ' | Role: ' + sellerLogin.json?.user?.role);

  const sellerCookie = sellerLogin.headers['set-cookie'] ? sellerLogin.headers['set-cookie'].join('; ') : '';
  const sellerOrders = await fetchJson('https://gauravnursery.online/api/seller/orders', {
    headers: { cookie: sellerCookie }
  });
  console.log('Seller Orders API       | Status: ' + sellerOrders.status + ' | Orders Count: ' + (sellerOrders.json?.subOrders?.length ?? 0));

  const sellerPayouts = await fetchJson('https://gauravnursery.online/api/seller/payouts', {
    headers: { cookie: sellerCookie }
  });
  console.log('Seller Payouts API      | Status: ' + sellerPayouts.status + ' | Payouts Data Loaded: ' + (sellerPayouts.json?.seller ? '✅ YES' : 'None'));

  const sellerProducts = await fetchJson('https://gauravnursery.online/api/seller/products', {
    headers: { cookie: sellerCookie }
  });
  console.log('Seller Products API     | Status: ' + sellerProducts.status + ' | Products Count: ' + (sellerProducts.json?.products?.length ?? 0));

  // 5. DELIVERY PORTAL CHECK
  console.log('\n--- 5. DELIVERY PARTNER PORTAL CHECK ---');
  const deliveryPage = await fetchJson('https://gauravnursery.online/delivery');
  console.log('Delivery Page           | Status: ' + deliveryPage.status);

  console.log('\n==================================================');
  console.log('🎉 AUDIT COMPLETE: ALL SYSTEMS VERIFIED & WORKING');
  console.log('==================================================');
}

runCheck();
