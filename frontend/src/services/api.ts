import axios from 'axios';

const api = axios.create({
    baseURL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api',
});

export const profileService = {
    getProfile: () => api.get('/profile'),
    updateProfile: (data: any) => api.put('/profile', data),
};

export const historyService = {
    getHistory: (params?: any) => api.get('/history', { params }),
    createHistory: (data: any) => api.post('/history', data),
};

export const chatService = {
    sendMessage: (message: string, ticker?: string) => api.post('/chat', { message, ticker }),
};

export const analysisService = {
    triggerAnalysis: (ticker: string, type: string, period?: string) => api.post('/analyze', { ticker, type, period }),
};

export const credentialsService = {
    getCredentials: () => api.get('/credentials'),
    updateCredentials: (data: any) => api.put('/credentials', data),
};

export const newsService = {
    getNews: () => api.get('/news'),
};

export default api;
