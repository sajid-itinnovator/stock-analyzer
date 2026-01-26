import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import userRoutes from './routes/userRoutes';
import historyRoutes from './routes/historyRoutes';
import chatRoutes from './routes/chatRoutes';
import analysisRoutes from './routes/analysisRoutes';
import credentialsRoutes from './routes/credentialsRoutes';
import newsRoutes from './routes/newsRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/profile', userRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/analyze', analysisRoutes);
app.use('/api/credentials', credentialsRoutes);
app.use('/api/news', newsRoutes);

const path = require('path');
// Serve static frontend in production
// When running from source, it's ../../frontend
// When running as exe (pkg), we expect 'frontend' folder next to the exe
const frontendPath = process.env.PKG_EXECPATH
    ? path.join(path.dirname(process.execPath), 'frontend')
    : path.join(__dirname, '../../frontend/dist'); // Point to dist when dev/build

app.use(express.static(frontendPath));

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend sub-system is running' });
});

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stockai';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('MongoDB connection error. Please ensure MongoDB is running locally:', err.message);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
