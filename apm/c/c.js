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
    await axios.post('http://localhost:3004/d', data);
}

// Start the server
app.listen(3003, () => {
    console.log('Server is running on port 3003');
});
