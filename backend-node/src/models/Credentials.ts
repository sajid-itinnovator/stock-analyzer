import mongoose, { Schema, Document } from 'mongoose';

export interface ICredentials extends Document {
    userId: mongoose.Types.ObjectId;
    llmProvider: {
        selectedProvider: string;
        apiKey: string;
        model: string;
    };
    webTools: {
        selectedTool: string;
        apiKey: string;
        mode: string;
    };
    searchTools: {
        selectedProvider: string;
        apiKey: string;
        mode: string;
    };
}

const CredentialsSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    llmProvider: {
        selectedProvider: { type: String, default: 'openai' },
        apiKey: { type: String, default: '' },
        model: { type: String, default: 'gpt-4' }
    },
    webTools: {
        selectedTool: { type: String, default: 'firecrawl' },
        apiKey: { type: String, default: '' },
        mode: { type: String, default: 'Standard' }
    },
    searchTools: {
        selectedProvider: { type: String, default: 'serper' },
        apiKey: { type: String, default: '' },
        mode: { type: String, default: 'Search' }
    }
}, { timestamps: true });

export default mongoose.model<ICredentials>('Credentials', CredentialsSchema);
