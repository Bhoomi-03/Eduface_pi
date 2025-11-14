// Simple test script to verify backend API connectivity
// Run: node src/utils/testApi.js (requires node-fetch or axios)

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function testEndpoints() {
  console.log(`Testing API at: ${API_BASE_URL}\n`);

  const endpoints = [
    { method: 'GET', path: '/students', requiresAuth: true },
    { method: 'GET', path: '/attendance?date=2025-11-14', requiresAuth: true },
    { method: 'GET', path: '/alerts', requiresAuth: true },
  ];

  for (const endpoint of endpoints) {
    try {
      const url = `${API_BASE_URL}${endpoint.path}`;
      console.log(`Testing ${endpoint.method} ${endpoint.path}...`);
      
      const response = await fetch(url, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          // Note: Add 'Authorization: Bearer <token>' if requiresAuth is true
        },
      });

      const data = await response.json();
      console.log(`✅ Status: ${response.status}`);
      console.log(`   Response:`, JSON.stringify(data).substring(0, 200));
    } catch (err) {
      console.log(`❌ Error:`, err.message);
    }
    console.log('');
  }
}

// Uncomment to run (requires running in Node.js environment)
// testEndpoints();

export { testEndpoints };
