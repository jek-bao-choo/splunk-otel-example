const express = require('express');
const axios = require('axios');

const app = express(); // WIP: try to use for example

// Middleware to handle JSON requests
app.use(express.json());

// POST endpoint to receive data from the client
app.post('/c', (req, res) => {
    console.log(`Received data from /b: ${JSON.stringify(req.body)}, calling /d`);
    sendData();
    res.status(200).send({ message: 'Get /c successfully' })
});

// WIP: try to receive via Kafka instead of through REST API
async function sendData() {
    const data = { message: 'Hello from /c' };
    const targetURL = process.env.TARGET_SERVICE_URL || 'http://localhost:3004/d'
    console.log("targetURL", targetURL);
    await axios.post(targetURL, data);
}

// Start the server
app.listen(3003, () => {
    console.log('Server c is running on port 3003');
});
