import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Credentials, { ICredentials } from '../models/Credentials';
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

// Helper to write local credentials
const writeLocalCredentials = (data: any) => {
    try {
        let existing = readLocalCredentials() || {};
        // Merge structured data
        const merged = { ...existing, ...data };

        // Ensure structure exists
        if (!merged.llmProvider) merged.llmProvider = { selectedProvider: 'openai', apiKey: '', model: 'gpt-4' };
        if (!merged.webTools) merged.webTools = { selectedTool: 'firecrawl', apiKey: '', mode: 'Standard' };
        if (!merged.searchTools) merged.searchTools = { selectedProvider: 'serper', apiKey: '', mode: 'Search' };

        fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(merged, null, 2));
        return merged;
    } catch (e) {
        console.error('Error writing local credentials:', e);
        return data;
    }
};

// @desc    Get user credentials
// @route   GET /api/credentials
// @access  Public
export const getCredentials = async (req: Request, res: Response) => {
    try {
        // Try MongoDB first
        if (mongoose.connection.readyState === 1) {
            const user = await User.findOne({ email: 'john.doe@example.com' });
            if (user) {
                let credentials = await Credentials.findOne({ userId: user._id });
                if (credentials) return res.json(credentials);
            }
        }

        // Fallback to local file
        const localCreds = readLocalCredentials();
        if (localCreds) return res.json(localCreds);

        // Return defaults
        return res.json({
            llmProvider: { selectedProvider: 'openai', apiKey: '', model: 'gpt-4' },
            webTools: { selectedTool: 'firecrawl', apiKey: '', mode: 'Standard' },
            searchTools: { selectedProvider: 'serper', apiKey: '', mode: 'Search' }
        });
    } catch (error: any) {
        // Fallback on any error
        const localCreds = readLocalCredentials();
        if (localCreds) return res.json(localCreds);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user credentials
// @route   PUT /api/credentials
// @access  Public
export const updateCredentials = async (req: Request, res: Response) => {
    try {
        // Try MongoDB first
        if (mongoose.connection.readyState === 1) {
            const user = await User.findOne({ email: 'john.doe@example.com' });
            if (user) {
                const credentials = await Credentials.findOneAndUpdate(
                    { userId: user._id },
                    { $set: req.body },
                    { new: true, upsert: true, runValidators: true }
                );
                return res.json(credentials);
            }
        }

        // Fallback to local file
        const saved = writeLocalCredentials(req.body);
        res.json(saved);

    } catch (error: any) {
        console.log('DB Save failed, saving to file instead');
        const saved = writeLocalCredentials(req.body);
        res.json(saved);
    }
};

// @desc    Get active API key for Python agent
// @route   GET /api/credentials/active-key
// @access  Public
export const getActiveApiKey = async (req: Request, res: Response) => {
    try {
        let apiKey = '';
        let provider = 'none';
        let model = '';

        // Try DB
        try {
            if (mongoose.connection.readyState === 1) { // 1 = Connected
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
        } catch (e) { }

        // Fallback to file if DB failed or no key found
        if (!apiKey) {
            const localCreds = readLocalCredentials();
            if (localCreds && localCreds.llmProvider && localCreds.llmProvider.apiKey) {
                apiKey = localCreds.llmProvider.apiKey;
                provider = localCreds.llmProvider.selectedProvider;
                model = localCreds.llmProvider.model;
            }
        }

        if (!apiKey) {
            return res.json({
                provider: 'none',
                apiKey: '',
                model: '',
                message: 'No API key configured.'
            });
        }

        res.json({
            provider,
            apiKey,
            model
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
