# Serverless APM Dashboard on IBM Cloud (Simulation)

**Project Version:** 1.0
**Date:** May 15, 2025

## About This Project

This project of a Serverless Application Performance Monitoring (APM) Dashboard designed conceptually for the IBM Cloud platform. Due to the inability to use an actual IBM Cloud account for development, this project demonstrates the core architecture, data flow, and potential functionality using local Node.js services, mock data, and a simple web interface.

The goal was to design an APM that could:
* Ingest logs and metrics from serverless applications (simulating IBM Cloud Functions).
* Process and store this telemetry data.
* Visualize the data on a dashboard to provide performance insights.



## Simulated IBM Cloud Services & APM Components:

1.  **`sample-monitored-app/`**:
    * Simulates a user's serverless application (e.g., an IBM Cloud Function).
    * Periodically generates mock log entries and performance metrics.
    * "Sends" this data via HTTP POST to the `apm-ingestion-service`.

2.  **`apm-ingestion-service/`**:
    * A Node.js/Express server that acts as the APM's data ingestion endpoint.
    * Receives mock logs and metrics from the `sample-monitored-app`.
    * Forwards the data to the `apm-processing-service` (or directly uses `apm-database-mock` in a simplified version).

3.  **`apm-database-mock/`**:
    * A simple module that simulates a database.
    * Stores data in a local JSON file (`mock_db.json`) or in-memory.
    * Provides functions to write and read APM data.

4.  **`apm-processing-service/`** (Conceptual - logic might be within ingestion or data-api):
    * Contains logic to process raw ingested data (e.g., aggregate metrics, summarize logs).
    * Interacts with the `apm-database-mock` to store processed data.

5.  **`apm-dashboard-ui/`**:
    * A static HTML, CSS, and JavaScript frontend that serves as the APM dashboard.
    * Fetches data from the `data-api-mock` (which reads from `apm-database-mock`).
    * Displays visualizations of the (mock) performance data.
    * **`data-api-mock/`**: A simple Node.js/Express server that exposes endpoints for the UI to fetch stored APM data.

## Core Technologies Used (for Simulation):

* Node.js
* Express.js (for simulating backend services and APIs)
* HTML, CSS, JavaScript (for the dashboard UI)
* JSON (for mock data storage)

## Project Structure:

apm-dashboard-ibm-cloud-simulation/├── README.md├── sample-monitored-app/│   ├── app.js│   └── package.json├── apm-ingestion-service/│   ├── server.js│   └── package.json├── apm-database-mock/│   └── db.js├── apm-dashboard-ui/│   ├── index.html│   ├── style.css│   ├── script.js│   └── data-api-mock/│       ├── server.js│       └── package.json└── (Other potential processing/utility modules)
## How to "Run" the Simulation (Conceptual Steps):

1.  **Prerequisites:** Node.js and npm installed.
2.  **Clone the repository.**
3.  **Install Dependencies:** Navigate into each service directory (`sample-monitored-app`, `apm-ingestion-service`, `apm-dashboard-ui/data-api-mock`) and run `npm install`.
4.  **Start the Services (in separate terminal windows):**
    * Start the `apm-database-mock` (if it's a standalone service, otherwise it's used as a module).
    * Start the `apm-ingestion-service`: `node apm-ingestion-service/server.js`
    * Start the `data-api-mock` for the dashboard: `node apm-dashboard-ui/data-api-mock/server.js`
    * Start the `sample-monitored-app`: `node sample-monitored-app/app.js`
5.  **View the Dashboard:** Open `apm-dashboard-ui/index.html` in a web browser.
6.  **Observe:**
    * The `sample-monitored-app` should start sending data.
    * The `apm-ingestion-service` should log received data.
    * Data should appear in `mock_db.json` (if using file storage).
    * The dashboard should update with the simulated data.





This project serves as a portfolio piece to illustrate understanding of APM concepts and system design within a simulated cloud environment.
