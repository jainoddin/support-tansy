const fs = require('fs');

async function testUrlUpload() {
  try {
    const res = await fetch('http://localhost:3000/api/upload/url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://via.placeholder.com/150' })
    });
    
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response text:", text.slice(0, 500));
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

testUrlUpload();
