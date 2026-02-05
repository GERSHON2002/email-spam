const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testSpam() {
  console.log('Testing Spam Classification...');
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze-text`, {
      text: "CONGRATULATIONS! You have won a $1000 Walmart gift card. Click here to claim your prize now: http://spam-link.com/win"
    });
    console.log('Result:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error testing spam:', error.message);
  }
}

async function testHam() {
  console.log('\nTesting Ham Classification...');
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze-text`, {
      text: "Hi team, please find the attached minutes from our meeting today. Let me know if you have any questions. Best, John."
    });
    console.log('Result:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error testing ham:', error.message);
  }
}

async function runTests() {
  await testSpam();
  await testHam();
}

runTests();
