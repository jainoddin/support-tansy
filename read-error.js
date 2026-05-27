const fs = require('fs');
const html = fs.readFileSync('output.json', 'utf8');
const errMatch = html.match(/"message":"([^"]+)"/);
if (errMatch) {
  console.log('Error Message:', errMatch[1]);
} else {
  console.log('No error message found in JSON payload.');
}

const stackMatch = html.match(/"stack":"([^"]+)"/);
if (stackMatch) {
  console.log('Stack Trace:', stackMatch[1].replace(/\\n/g, '\n'));
}
