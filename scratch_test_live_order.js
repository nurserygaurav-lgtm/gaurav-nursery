const https = require('https');

function makeRequest(url, options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function test() {
  // 1. Register customer
  const email = 'test.buyer.' + Date.now() + '@example.com';
  const regPayload = JSON.stringify({
    name: 'Gaurav Customer',
    email: email,
    password: 'Password@123',
    role: 'CUSTOMER',
    phone: '+91 9876543210'
  });

  console.log('1. Registering customer...');
  const regRes = await makeRequest('https://gauravnursery.online/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(regPayload) }
  }, regPayload);

  console.log('Reg status:', regRes.status);
  const cookie = regRes.headers['set-cookie'] ? regRes.headers['set-cookie'][0].split(';')[0] : '';
  console.log('Cookie:', cookie);

  // 2. Place order via /api/checkout
  console.log('2. Placing order...');
  const checkoutPayload = JSON.stringify({
    customerName: 'Gaurav Customer',
    customerEmail: email,
    customerPhone: '+91 9876543210',
    shippingAddress: '123 Green Avenue',
    shippingCity: 'Ahmedabad',
    shippingState: 'Gujarat',
    shippingPincode: '380015',
    paymentMethod: 'TEST_PAYMENT',
    items: [
      {
        productId: 'demo-adenium',
        title: 'Adenium Desert Rose',
        price: 849,
        quantity: 1,
        sellerId: 'demo-seller'
      }
    ]
  });

  const checkoutRes = await makeRequest('https://gauravnursery.online/api/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(checkoutPayload),
      'Cookie': cookie
    }
  }, checkoutPayload);

  console.log('Checkout status:', checkoutRes.status);
  console.log('Checkout body:', checkoutRes.body);

  // 3. Fetch /orders
  console.log('3. Fetching /orders...');
  const ordersRes = await makeRequest('https://gauravnursery.online/orders', {
    method: 'GET',
    headers: { 'Cookie': cookie }
  });

  console.log('Orders status:', ordersRes.status);
  const hasNoOrders = ordersRes.body.includes('No orders yet');
  console.log('Contains No orders yet?', hasNoOrders);
  if (!hasNoOrders) {
    console.log('Orders found in response!');
  }
}

test().catch(console.error);
