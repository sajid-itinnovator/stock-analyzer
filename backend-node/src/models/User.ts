import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    avatar?: string;
    subscription: {
        plan: 'Free' | 'Pro' | 'Enterprise';
        status: string;
    };
    notifications: {
        email: boolean;
        push: boolean;
        reports: boolean;
    };
    riskProfile: {
        investmentStyle: string;
        riskLevel: number;
    };
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    subscription: {
        plan: { type: String, enum: ['Free', 'Pro', 'Enterprise'], default: 'Free' },
        status: { type: String, default: 'Active' }
    },
    notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: false },
        reports: { type: Boolean, default: true }
    },
    riskProfile: {
        investmentStyle: { type: String, default: 'Moderate' },
        riskLevel: { type: Number, default: 3 }
    }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
