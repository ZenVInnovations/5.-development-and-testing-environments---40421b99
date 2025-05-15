// apm-ingestion-service/server.js
// Simulates the APM's data ingestion endpoint.

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001; // Port for the ingestion service

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// In-memory store for received data (temporary, will be replaced by db-mock interaction)
const receivedDataStore = [];

// Endpoint to receive data from monitored applications
app.post('/ingest', (req, res) => {
    const data = req.body;
    const timestamp = new Date().toISOString();

    if (!data || Object.keys(data).length === 0) {
        console.warn(`[${timestamp}] [Ingestion Service] Received empty request body.`);
        return res.status(400).json({ message: 'Bad Request: Empty payload.' });
    }

    console.log(`[${timestamp}] [Ingestion Service] Received data:`, JSON.stringify(data, null, 2));

    // Simulate storing or forwarding the data
    // For now, just add to an in-memory array and log
    receivedDataStore.push({ receivedAt: timestamp, payload: data });

    // TODO:
    // 1. Validate the data structure.
    // 2. Forward to apm-processing-service or directly save to apm-database-mock.
    // For this simulation, we'll eventually save it to our mock DB from here.

    res.status(200).json({ message: 'Data received successfully by APM Ingestion Service.' });
});

// Simple health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'APM Ingestion Service is running.' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`[Ingestion Service] APM Ingestion Service listening on http://localhost:${PORT}`);
    console.log(`[Ingestion Service] Expecting data on POST /ingest`);
});

// Graceful shutdown (optional, but good practice for local dev)
process.on('SIGINT', () => {
    console.log('[Ingestion Service] Shutting down...');
    // Perform any cleanup here if necessary
    process.exit(0);
});
