// File: sample-monitored-app.js
function main(params) {
  const now = new Date();
  const log = {
    app: "sample-monitored-app",
    timestamp: now.toISOString(),
    latencyMs: Math.floor(Math.random() * 500),
    success: Math.random() > 0.1, // simulate occasional errors
  };

  console.log(JSON.stringify(log));
  return {
    statusCode: 200,
    body: log,
  };
}
