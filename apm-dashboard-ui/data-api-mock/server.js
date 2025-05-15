// apm-dashboard-ui/data-api-mock/server.js
// Mock API to serve APM data to the dashboard UI.

const express = require('express');
const cors = require('cors'); // To allow requests from the frontend
const path = require('path');

// Import the mock database functions
// Adjust path if your directory structure is different.
// Assumes data-api-mock is inside apm-dashboard-ui, and apm-database-mock is at the root level.
const dbMock = require(path.join(__dirname, '../../../apm-database-mock/db.js'));

const app = express();
const PORT = 3002; // Port for the data API service

// Enable CORS for all routes
app.use(cors());

// Middleware for logging requests (optional)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] [Data API] Received ${req.method} request for ${req.url}`);
    next();
});

// --- API Endpoints ---

// Endpoint to get all raw ingested data
app.get('/api/data/all', (req, res) => {
    try {
        const allData = dbMock.getAllData();
        res.json(allData);
    } catch (error) {
        console.error('[Data API] Error retrieving all data:', error);
        res.status(500).json({ message: 'Error retrieving data from mock DB.' });
    }
});

// Endpoint to get only logs
app.get('/api/data/logs', (req, res) => {
    try {
        const logs = dbMock.getLogs();
        res.json(logs);
    } catch (error) {
        console.error('[Data API] Error retrieving logs:', error);
        res.status(500).json({ message: 'Error retrieving logs from mock DB.' });
    }
});

// Endpoint to get only metrics
app.get('/api/data/metrics', (req, res) => {
    try {
        const metrics = dbMock.getMetrics();
        res.json(metrics);
    } catch (error) {
        console.error('[Data API] Error retrieving metrics:', error);
        res.status(500).json({ message: 'Error retrieving metrics from mock DB.' });
    }
});

// Example of a more processed/aggregated data endpoint (conceptual)
app.get('/api/data/summary', (req, res) => {
    try {
        const allData = dbMock.getAllData();
        const logs = dbMock.getLogs();
        const metrics = dbMock.getMetrics();

        const summary = {
            totalIngestedItems: allData.length,
            totalLogs: logs.length,
            totalMetrics: metrics.length,
            errorCount: logs.filter(log => log.level === 'ERROR').length,
            // Add more aggregations as needed for the dashboard
            // For example, average duration from metrics, invocation counts etc.
            // This requires more sophisticated processing of the raw metric objects.
            // For now, this is a simple summary.
        };
        // Example: Calculate total invocations and errors from metric type data
        let totalInvocations = 0;
        let totalMetricErrors = 0;
        metrics.forEach(metric => {
            if (metric.metrics && typeof metric.metrics.invocations === 'number') {
                totalInvocations += metric.metrics.invocations;
            }
            if (metric.metrics && typeof metric.metrics.errors === 'number') {
                totalMetricErrors += metric.metrics.errors;
            }
        });
        summary.totalFunctionInvocations = totalInvocations;
        summary.totalFunctionMetricErrors = totalMetricErrors;


        res.json(summary);
    } catch (error) {
        console.error('[Data API] Error generating summary:', error);
        res.status(500).json({ message: 'Error generating data summary.' });
    }
});


// Simple health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'APM Data API Mock Service is running.' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`[Data API] APM Data API Mock Service listening on http://localhost:${PORT}`);
    console.log(`[Data API] Endpoints available:`);
    console.log(`  GET /api/data/all`);
    console.log(`  GET /api/data/logs`);
    console.log(`  GET /api/data/metrics`);
    console.log(`  GET /api/data/summary`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('[Data API] Shutting down...');
    process.exit(0);
});
