// apm-database-mock/db.js
// Simple in-memory database mock for APM data.
// Can be extended to use a JSON file for persistence.

// In-memory store for logs and metrics
const logs = [];
const metrics = [];
const allData = []; // To store raw ingested data with timestamps

const MAX_ITEMS = 500; // Max items to keep in memory to prevent unbounded growth

/**
 * Saves data to the appropriate in-memory store.
 * @param {Object} data - The data object received by the ingestion service.
 * It should have a 'type' field ('log' or 'metric').
 */
function saveData(ingestedPayload) {
    const timestamp = new Date().toISOString();
    console.log(`[DB Mock][${timestamp}] Saving data:`, JSON.stringify(ingestedPayload, null, 2));

    // Store raw data with a received timestamp
    if (allData.length >= MAX_ITEMS) {
        allData.shift(); // Remove the oldest item
    }
    allData.push({ receivedAt: timestamp, payload: ingestedPayload });

    // Categorize and store
    if (ingestedPayload && ingestedPayload.type === 'log') {
        if (logs.length >= MAX_ITEMS) {
            logs.shift(); // Remove the oldest log
        }
        logs.push(ingestedPayload);
        console.log(`[DB Mock] Log saved. Total logs: ${logs.length}`);
    } else if (ingestedPayload && ingestedPayload.type === 'metric') {
        if (metrics.length >= MAX_ITEMS) {
            metrics.shift(); // Remove the oldest metric
        }
        metrics.push(ingestedPayload);
        console.log(`[DB Mock] Metric saved. Total metrics: ${metrics.length}`);
    } else {
        console.warn(`[DB Mock][${timestamp}] Unknown data type received or data is null:`, ingestedPayload);
        return false;
    }
    return true;
}

/**
 * Retrieves all stored logs.
 * @returns {Array} An array of log objects.
 */
function getLogs() {
    console.log(`[DB Mock] Retrieving all logs. Count: ${logs.length}`);
    return [...logs]; // Return a copy
}

/**
 * Retrieves all stored metrics.
 * @returns {Array} An array of metric objects.
 */
function getMetrics() {
    console.log(`[DB Mock] Retrieving all metrics. Count: ${metrics.length}`);
    return [...metrics]; // Return a copy
}

/**
 * Retrieves all raw ingested data.
 * @returns {Array} An array of all data objects with their received timestamps.
 */
function getAllData() {
    console.log(`[DB Mock] Retrieving all ingested data. Count: ${allData.length}`);
    return [...allData]; // Return a copy
}

/**
 * Clears all data from the mock database.
 */
function clearAllData() {
    logs.length = 0;
    metrics.length = 0;
    allData.length = 0;
    console.log('[DB Mock] All data cleared.');
}

// --- File-based persistence (Example - not enabled by default) ---
/*
const fs = require('fs');
const path = require('path');
const DB_FILE_PATH = path.join(__dirname, 'mock_db.json');

function loadDataFromFile() {
    try {
        if (fs.existsSync(DB_FILE_PATH)) {
            const fileData = fs.readFileSync(DB_FILE_PATH, 'utf-8');
            const parsedData = JSON.parse(fileData);
            if (parsedData.logs) logs.push(...parsedData.logs.slice(-MAX_ITEMS));
            if (parsedData.metrics) metrics.push(...parsedData.metrics.slice(-MAX_ITEMS));
            if (parsedData.allData) allData.push(...parsedData.allData.slice(-MAX_ITEMS));
            console.log('[DB Mock] Data loaded from file.');
        }
    } catch (error) {
        console.error('[DB Mock] Error loading data from file:', error);
    }
}

function saveDataToFile() {
    try {
        const dataToSave = {
            logs: logs.slice(-MAX_ITEMS), // Save only the most recent items
            metrics: metrics.slice(-MAX_ITEMS),
            allData: allData.slice(-MAX_ITEMS)
        };
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
        console.log('[DB Mock] Data saved to file.');
    } catch (error)
        console.error('[DB Mock] Error saving data to file:', error);
    }
}

// Call loadDataFromFile() when the module starts if you want file persistence.
// loadDataFromFile();

// Modify saveData to also call saveDataToFile() if using file persistence.
// For example, inside saveData function:
// if (saveSuccessful) { saveDataToFile(); }
*/


module.exports = {
    saveData,
    getLogs,
    getMetrics,
    getAllData,
    clearAllData
    // If using file persistence:
    // saveDataToFile, // expose if manual saving is needed
    // loadDataFromFile // expose if manual loading is needed
};
