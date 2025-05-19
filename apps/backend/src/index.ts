import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/api/health', (_, res) => {
  res.status(200).json({ message: 'API is working 🚀' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
