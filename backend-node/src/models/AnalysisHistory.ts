import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalysisHistory extends Document {
    userId: mongoose.Types.ObjectId;
    ticker: string;
    type: 'Fundamental' | 'Technical' | 'Sentiment' | 'Risk';
    rating: string;
    summary: string;
    keyMetrics: Record<string, any>;
    timestamp: Date;
}

const AnalysisHistorySchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ticker: { type: String, required: true },
    type: { type: String, enum: ['Fundamental', 'Technical', 'Sentiment', 'Risk'], required: true },
    rating: { type: String },
    summary: { type: String },
    keyMetrics: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IAnalysisHistory>('AnalysisHistory', AnalysisHistorySchema);
