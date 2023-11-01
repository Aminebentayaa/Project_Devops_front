const express = require('express');
const promBundle = require('express-prom-bundle');
const promClient = require('prom-client');

const metricsInterval = promClient.collectDefaultMetrics();
const app = express();
const port = 8087;  // The port your application exposes metrics on

// Create a metric for tracking requests
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in milliseconds',
  labelNames: ['method', 'route'],
  buckets: [0.1, 5, 15, 50, 100, 500],
});

app.use((req, res, next) => {
  res.locals.startEpoch = Date.now();
  next();
});

app.use((req, res, next) => {
  const responseTimeInMs = Date.now() - res.locals.startEpoch;
  httpRequestDurationMicroseconds
    .labels(req.method, req.route.path)
    .observe(responseTimeInMs);
  next();
});

// Expose Prometheus metrics on /metrics
app.get('/metrics', (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(promClient.register.metrics());
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
