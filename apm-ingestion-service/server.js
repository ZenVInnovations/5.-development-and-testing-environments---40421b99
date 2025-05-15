// apm-ingestion-service/server.js
// Simulates the APM's data ingestion endpoint.
// Updated to use the apm-database-mock.

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Required for relative path to db.js

// Import the mock database functions
// The path might need adjustment based on your final directory structure.
// Assuming apm-ingestion-service and apm-database-mock are sibling directories.
const dbMock = require(path.join(__dirname, '../apm-database-mock/db.js'));

const app = express();
const PORT = 3001; // Port for the ingestion service

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to receive data from monitored applications
app.post('/ingest', (req, res) => {
    const data = req.body;
    const timestamp = new Date().toISOString();

    if (!data || Object.keys(data).length === 0) {
        console.warn(`[${timestamp}] [Ingestion Service] Received empty request body.`);
        return res.status(400).json({ message: 'Bad Request: Empty payload.' });
    }

    console.log(`[${timestamp}] [Ingestion Service] Received data of type '${data.type}'. Attempting to save.`);

    // Save the data using our mock database
    try {
        const saveSuccessful = dbMock.saveData(data);
        if (saveSuccessful) {
            console.log(`[${timestamp}] [Ingestion Service] Data saved to mock DB successfully.`);
            res.status(200).json({ message: 'Data received and stored successfully by APM Ingestion Service.' });
        } else {
            // This case might occur if saveData returns false for unknown types, though our current db.js doesn't explicitly do that for the return value.
            console.warn(`[${timestamp}] [Ingestion Service] Data received but could not be categorized or saved properly in mock DB.`);
            res.status(202).json({ message: 'Data received, but not categorized as log or metric by DB mock.' });
        }
    } catch (error) {
        console.error(`[${timestamp}] [Ingestion Service] Error while trying to save data to mock DB:`, error);
        res.status(500).json({ message: 'Internal Server Error: Could not process and store data.' });
    }
});

// Simple health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'APM Ingestion Service is running.' });
});

// Endpoint to view all data (for debugging purposes)
app.get('/view-all-data', (req, res) => {
    try {
        const allData = dbMock.getAllData();
        res.status(200).json(allData);
    } catch (error) {
        console.error('[Ingestion Service] Error retrieving all data:', error);
        res.status(500).json({ message: 'Error retrieving data.' });
    }
});

// Endpoint to clear all data (for debugging/resetting purposes)
app.delete('/clear-all-data', (req, res) => {
    try {
        dbMock.clearAllData();
        res.status(200).json({ message: 'All data cleared from mock DB.' });
    } catch (error) {
        console.error('[Ingestion Service] Error clearing data:', error);
        res.status(500).json({ message: 'Error clearing data.' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`[Ingestion Service] APM Ingestion Service listening on http://localhost:${PORT}`);
    console.log(`[Ingestion Service] Expecting data on POST /ingest`);
    console.log(`[Ingestion Service] Debug endpoint to view data: GET /view-all-data`);
    console.log(`[Ingestion Service] Debug endpoint to clear data: DELETE /clear-all-data`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('[Ingestion Service] Shutting down...');
    // Perform any cleanup here if necessary
    process.exit(0);
});

