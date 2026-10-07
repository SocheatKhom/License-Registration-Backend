import express from 'express';
// import your routes here, e.g.:
// import routes from './src/routes/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// app.use('/api', routes);

export default app;