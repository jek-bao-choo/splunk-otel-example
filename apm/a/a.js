const express = require('express');
const axios = require('axios');

const app = express();

// Middleware to handle JSON requests
app.use(express.json());

app.get('/a', (req, res) => {
    console.log('Get /a successfully, calling /b');
    sendData();
    res.status(200).send({ message: 'Get /a successfully' })
})

async function sendData() {
    const data = { message: 'Hello from /a' };
    const targetURL = process.env.TARGET_SERVICE_URL || 'http://localhost:3002/b'
    console.log("targetURL", targetURL);
    await axios.post(targetURL, data);
}


// Start the server
app.listen(3001, () => {
    console.log('Server a is running on port 3001');
});
