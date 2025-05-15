// apm-dashboard-ui/script.js

document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3002/api/data'; // Base URL of our data-api-mock

    // DOM Elements for summary
    const totalItemsEl = document.getElementById('total-items');
    const totalInvocationsEl = document.getElementById('total-invocations');
    const totalLogsEl = document.getElementById('total-logs');
    const totalErrorsEl = document.getElementById('total-errors');

    // DOM Elements for data sections
    const metricsDataEl = document.getElementById('metrics-data');
    const logsDataEl = document.getElementById('logs-data');
    const allDataEl = document.getElementById('all-data');

    // Tab navigation elements
    const tabButtons = document.querySelectorAll('.ui-tab');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const refreshButton = document.getElementById('refresh-data-btn');

    // --- Data Fetching Functions ---
    async function fetchData(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} on ${endpoint}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            return null; // Or an empty array/object as appropriate
        }
    }

    // --- Rendering Functions ---
    function renderSummary(summaryData) {
        if (!summaryData) {
            totalItemsEl.textContent = 'Error';
            totalInvocationsEl.textContent = 'Error';
            totalLogsEl.textContent = 'Error';
            totalErrorsEl.textContent = 'Error';
            return;
        }
        totalItemsEl.textContent = summaryData.totalIngestedItems || 0;
        totalInvocationsEl.textContent = summaryData.totalFunctionInvocations || 0;
        totalLogsEl.textContent = summaryData.totalLogs || 0;
        totalErrorsEl.textContent = summaryData.errorCount || 0;
    }

    function renderTable(data, parentElement, type) {
        if (!data || data.length === 0) {
            parentElement.innerHTML = `<p class="text-gray-500 p-4">No ${type} data available.</p>`;
            return;
        }

        let headers = [];
        if (type === 'logs' && data.length > 0) {
            headers = ['Timestamp', 'Level', 'Function', 'Message', 'Invocation ID'];
        } else if (type === 'metrics' && data.length > 0) {
            headers = ['Timestamp', 'Function', 'Status', 'Duration (ms)', 'Memory (MB)', 'Invocation ID'];
        } else {
             parentElement.innerHTML = `<p class="text-gray-500 p-4">Could not determine headers for ${type}.</p>`;
            return;
        }


        const table = document.createElement('table');
        table.className = 'min-w-full divide-y divide-gray-200 table-auto rounded-lg shadow-sm'; // Tailwind classes
        const thead = document.createElement('thead');
        thead.className = 'bg-gray-50';
        const headerRow = document.createElement('tr');
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.className = 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        tbody.className = 'bg-white divide-y divide-gray-200';
        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50 transition-colors';

            if (type === 'logs') {
                tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${new Date(item.timestamp).toLocaleString()}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium log-level-${item.level || 'UNKNOWN'}">${item.level || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${item.functionName || 'N/A'}</td>
                    <td class="px-6 py-4 text-sm text-gray-700 break-all">${item.message || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.invocationId || 'N/A'}</td>
                `;
            } else if (type === 'metrics') {
                 tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${new Date(item.timestamp).toLocaleString()}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${item.functionName || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium metric-status-${item.status || 'unknown'}">${item.status || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${item.durationMs || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${item.memoryUsedMb || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.invocationId || 'N/A'}</td>
                `;
            }
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        parentElement.innerHTML = ''; // Clear previous content (e.g., "Loading...")
        parentElement.appendChild(table);
    }

    function renderAllRawData(allDataArray) {
        if (!allDataArray || allDataArray.length === 0) {
            allDataEl.innerHTML = '<p class="text-gray-500 p-4">No raw data available.</p>';
            return;
        }
        // Display as a list of JSON objects
        const list = document.createElement('ul');
        list.className = 'space-y-4';
        allDataArray.forEach(dataItem => {
            const listItem = document.createElement('li');
            const pre = document.createElement('pre');
            pre.textContent = JSON.stringify(dataItem, null, 2);
            listItem.appendChild(pre);
            list.appendChild(listItem);
        });
        allDataEl.innerHTML = '';
        allDataEl.appendChild(list);
    }


    // --- Tab Navigation Logic ---
    function switchTab(targetTabId) {
        tabButtons.forEach(button => {
            const isTarget = button.id === `${targetTabId}-btn`;
            button.classList.toggle('active-tab', isTarget);
            button.setAttribute('aria-selected', isTarget);
        });
        tabPanels.forEach(panel => {
            panel.classList.toggle('hidden', panel.id !== targetTabId);
        });
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTabId = button.getAttribute('aria-controls');
            switchTab(targetTabId);
        });
    });

    // --- Initial Data Load ---
    async function loadAllData() {
        // Set loading states
        totalItemsEl.textContent = 'Loading...';
        totalInvocationsEl.textContent = 'Loading...';
        totalLogsEl.textContent = 'Loading...';
        totalErrorsEl.textContent = 'Loading...';
        metricsDataEl.innerHTML = '<p class="text-gray-500 p-4">Loading metrics...</p>';
        logsDataEl.innerHTML = '<p class="text-gray-500 p-4">Loading logs...</p>';
        allDataEl.innerHTML = '<p class="text-gray-500 p-4">Loading all raw data...</p>';

        const summaryData = await fetchData('summary');
        const metrics = await fetchData('metrics');
        const logs = await fetchData('logs');
        const allRawData = await fetchData('all');

        renderSummary(summaryData);
        renderTable(metrics, metricsDataEl, 'metrics');
        renderTable(logs, logsDataEl, 'logs');
        renderAllRawData(allRawData);
    }

    if (refreshButton) {
        refreshButton.addEventListener('click', loadAllData);
    }

    // Load data on page load and set default tab
    loadAllData();
    switchTab('metrics-content'); // Default to metrics tab
});
