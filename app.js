const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Main page - shows it's alive and which build/version is running
app.get('/', (req, res) => {
  res.json({
    message: 'Hello from Jenkins + Kubernetes demo app!',
    version: process.env.APP_VERSION || 'dev',
    hostname: require('os').hostname()
  });
});

// Liveness probe target - cheap, no dependencies, just proves the process responds
app.get('/healthz/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

// Readiness probe target - in a real app this would check DB/cache connections.
// Kept simple here since this demo has no external dependency.
app.get('/healthz/ready', (req, res) => {
  res.status(200).json({ status: 'ready' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
