import { Request, Response } from 'express';
import AnalysisHistory from '../models/AnalysisHistory';
import User from '../models/User';

// @desc    Get all analysis history
// @route   GET /api/history
// @access  Public
export const getHistory = async (req: Request, res: Response) => {
    try {
        const { ticker, type } = req.query;
        let query: any = {};

        if (ticker) query.ticker = { $regex: ticker, $options: 'i' };
        if (type) query.type = type;

        const history = await AnalysisHistory.find(query).sort({ timestamp: -1 });
        res.json(history);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new analysis record
// @route   POST /api/history
// @access  Public
export const createHistoryRecord = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ email: 'john.doe@example.com' });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newRecord = await AnalysisHistory.create({
            ...req.body,
            userId: user._id,
            timestamp: new Date()
        });

        res.status(201).json(newRecord);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
