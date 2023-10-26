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
    await axios.post('http://localhost:3002/b', data);
}


// Start the server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
