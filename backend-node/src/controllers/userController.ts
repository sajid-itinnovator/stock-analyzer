import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';

// Mock User Data for fallback
const MOCK_USER = {
    _id: "mock_user_id",
    name: 'John Doe',
    email: 'john.doe@example.com',
    subscription: { plan: 'Pro', status: 'Active' },
    notifications: { email: true, push: false, reports: true },
    riskProfile: { investmentStyle: 'Moderate', riskLevel: 3 }
};

// @desc    Get user profile
// @route   GET /api/profile
// @access  Public (Seed user for demo)
export const getProfile = async (req: Request, res: Response) => {
    try {
        if (mongoose.connection.readyState === 1) {
            let user = await User.findOne({ email: 'john.doe@example.com' });
            if (!user) {
                user = await User.create({ ...MOCK_USER, _id: undefined });
            }
            return res.json(user);
        }

        // Fallback if DB is not connected
        return res.json(MOCK_USER);
    } catch (error: any) {
        // Fallback on error
        console.error('User profile fetch failed, using mock data:', error.message);
        return res.json(MOCK_USER);
    }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Public
export const updateProfile = async (req: Request, res: Response) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const user = await User.findOneAndUpdate(
                { email: 'john.doe@example.com' },
                { $set: req.body },
                { new: true, runValidators: true }
            );

            if (user) return res.json(user);
        }

        // Fallback logic could be added here (e.g. save to file), 
        // but for now we just return the updated mock
        return res.json({ ...MOCK_USER, ...req.body });
    } catch (error: any) {
        console.error('User profile update failed:', error.message);
        // Return mostly successful response to keep UI working
        res.json({ ...MOCK_USER, ...req.body });
    }
};
