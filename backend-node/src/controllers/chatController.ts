import { Request, Response } from 'express';
import axios from 'axios';
import mongoose from 'mongoose';
import Credentials from '../models/Credentials';
import User from '../models/User';
import fs from 'fs';
import path from 'path';

const CREDENTIALS_FILE = path.join(__dirname, '../../credentials.json');

// Helper to read local credentials
const readLocalCredentials = (): any => {
    try {
        if (fs.existsSync(CREDENTIALS_FILE)) {
            return JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf-8'));
        }
    } catch (e) {
        console.error('Error reading local credentials:', e);
    }
    return null;
};

// @desc    Proxy chat message to Python AI Agent
// @route   POST /api/chat
// @access  Public
export const proxyChat = async (req: Request, res: Response) => {
    try {
        const { message, ticker } = req.body;

        // Fetch user credentials (safely)
        let apiKey = '';
        let provider = 'none';
        let model = '';

        try {
            // Priority 1: MongoDB
            if (mongoose.connection.readyState === 1) {
                const user = await User.findOne({ email: 'john.doe@example.com' });
                if (user) {
                    const credentials = await Credentials.findOne({ userId: user._id });
                    if (credentials && credentials.llmProvider.apiKey) {
                        apiKey = credentials.llmProvider.apiKey;
                        provider = credentials.llmProvider.selectedProvider;
                        model = credentials.llmProvider.model;
                    }
                }
            }
        } catch (dbError) {
            console.log('Database lookup failed, ignoring');
        }

        // Priority 2: Local File (Fallback if no key found in DB or DB failed)
        if (!apiKey) {
            const localCreds = readLocalCredentials();
            if (localCreds && localCreds.llmProvider && localCreds.llmProvider.apiKey) {
                console.log('Using local credentials file for chat');
                apiKey = localCreds.llmProvider.apiKey;
                provider = localCreds.llmProvider.selectedProvider;
                model = localCreds.llmProvider.model;
            }
        }

        // Placeholder for Python Agent URL
        const BASE_URL = process.env.PYTHON_AGENT_URL || 'http://localhost:8000';

        // Send to Python agent with credentials
        try {
            const response = await axios.post(`${BASE_URL}/agent/chat`, {
                message,
                ticker,
                apiKey,
                provider,
                model
            });
            return res.json(response.data);
        } catch (error) {
            return res.json({
                sender: 'AI Advisor',
                text: `I received your message about ${ticker || 'the market'}: "${message}". (Note: ${apiKey ? 'Python AI Agent failed to process request' : 'Connection to AI Agent failed'})`,
                timestamp: new Date()
            });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
