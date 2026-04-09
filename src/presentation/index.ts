import express from 'express';
import mockRoutes from './routes/MockRoutes.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Apply Routes
app.use('/api', mockRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Data Mock API running on http://localhost:${PORT}`);
});
