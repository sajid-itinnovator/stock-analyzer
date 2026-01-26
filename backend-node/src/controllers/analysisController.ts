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

// @desc    Trigger stock analysis via Python Agent
// @route   POST /api/analyze
// @access  Public
export const triggerAnalysis = async (req: Request, res: Response) => {
    try {
        const { ticker, type, period } = req.body;

        const BASE_URL = process.env.PYTHON_AGENT_URL || 'http://localhost:8000';

        // Fetch credentials (safely)
        let apiKey = '';
        let provider = 'none';

        try {
            // Priority 1: MongoDB
            if (mongoose.connection.readyState === 1) {
                const user = await User.findOne({ email: 'john.doe@example.com' });
                if (user) {
                    const credentials = await Credentials.findOne({ userId: user._id });
                    if (credentials) {
                        if (type.toLowerCase() === 'news') {
                            if (credentials.searchTools?.apiKey) {
                                apiKey = credentials.searchTools.apiKey;
                                provider = credentials.searchTools.selectedProvider;
                            } else if (credentials.webTools?.apiKey) {
                                apiKey = credentials.webTools.apiKey;
                                provider = credentials.webTools.selectedTool;
                            }
                        } else {
                            // For Advisor, Fundamental, Technical, Risk, Sentiment -> Use LLM
                            if (credentials.llmProvider?.apiKey) {
                                apiKey = credentials.llmProvider.apiKey;
                                provider = credentials.llmProvider.selectedProvider;
                            }
                        }
                    }
                }
            }
        } catch (dbError) {
            console.log('Database lookup failed, ignoring');
        }

        // Priority 2: Local File
        if (!apiKey) {
            const localCreds = readLocalCredentials();
            if (localCreds) {
                if (type.toLowerCase() === 'news') {
                    if (localCreds.searchTools?.apiKey) {
                        apiKey = localCreds.searchTools.apiKey;
                        provider = localCreds.searchTools.selectedProvider;
                    } else if (localCreds.webTools?.apiKey) {
                        apiKey = localCreds.webTools.apiKey;
                        provider = localCreds.webTools.selectedTool;
                    }
                } else {
                    // LLM for others
                    if (localCreds.llmProvider?.apiKey) {
                        apiKey = localCreds.llmProvider.apiKey;
                        provider = localCreds.llmProvider.selectedProvider;
                    }
                }
            }
        }

        try {
            const response = await axios.post(`${BASE_URL}/agent/analyze`, {
                ticker,
                type,
                apiKey,
                provider,
                period
            });
            return res.json(response.data);
        } catch (error) {
            // Fallback response
            return res.json({
                ticker,
                type,
                rating: 'Hold',
                summary: `Simulated ${type} analysis (Python Agent unavailable).`,
                keyMetrics: {},
                timestamp: new Date()
            });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
