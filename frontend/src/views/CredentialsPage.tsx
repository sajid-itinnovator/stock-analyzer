import React, { useState } from 'react';
import { credentialsService } from '../services/api';
import '../styles/credentials.css';

interface ApiKeyConfig {
    id: string;
    name: string;
    description: string;
    icon: string;
    placeholder: string;
    models: string[];
}

const INITIAL_PROVIDERS: ApiKeyConfig[] = [
    {
        id: 'openai',
        name: 'OpenAI',
        description: 'Used for advanced reasoning, chat, and fundamental analysis.',
        icon: '🤖',
        placeholder: 'sk-...',
        models: ['gpt-4o', 'gpt-4o-mini', 'o1-preview', 'gpt-3.5-turbo']
    },
    {
        id: 'anthropic',
        name: 'Anthropic',
        description: 'Used for long-form report generation and deep technical analysis.',
        icon: '🧠',
        placeholder: 'sk-ant-...',
        models: ['claude-3-5-sonnet', 'claude-3-opus', 'claude-3-haiku']
    },
    {
        id: 'google',
        name: 'Google Gemini',
        description: 'Used for real-time market data processing and sentiment analysis.',
        icon: '✨',
        placeholder: 'AIza...',
        models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro']
    },
    {
        id: 'ollama',
        name: 'Ollama (Local)',
        description: 'Local LLM server. Ensure Ollama is running on your machine.',
        icon: '🦙',
        placeholder: 'http://localhost:11434',
        models: ['llama3', 'mistral', 'phi3', 'codellama']
    },
    {
        id: 'lmstudio',
        name: 'LM Studio (Local)',
        description: 'Local LLM server with OpenAI-compatible API.',
        icon: '💻',
        placeholder: 'http://localhost:1234/v1',
        models: ['local-model']
    }
];

const WEB_TOOLS: ApiKeyConfig[] = [
    {
        id: 'firecrawl',
        name: 'Firecrawl',
        description: 'Turn websites into LLM-ready markdown. Deep crawling and scraping support.',
        icon: '🔥',
        placeholder: 'fc-...',
        models: ['Standard', 'Turbo', 'Technical']
    },
    {
        id: 'crawl4ai',
        name: 'Crawl4AI',
        description: 'Open-source web scraping tailored for AI agents and RAG pipelines.',
        icon: '🕷️',
        placeholder: 'API Key (if using cloud)',
        models: ['Smart Reader', 'Markdown Only', 'Raw HTML']
    },
    {
        id: 'spider',
        name: 'Spider Cloud',
        description: 'High-performance web crawler and scraper for massive data collection.',
        icon: '🕸️',
        placeholder: 'API Key',
        models: ['Crawler', 'Scraper', 'Screenshot']
    }
];

const SEARCH_TOOLS: ApiKeyConfig[] = [
    {
        id: 'serper',
        name: 'Serper.dev',
        description: 'Google Search API for real-time web results and news.',
        icon: '🔍',
        placeholder: 'Enter Serper API Key',
        models: ['Search', 'News', 'Places']
    },
    {
        id: 'duckduckgo',
        name: 'DuckDuckGo',
        description: 'Privacy-focused search engine. Often used via free wrappers or local tools.',
        icon: '🦆',
        placeholder: 'API Key (if required)',
        models: ['Search', 'Instant Answer']
    },
    {
        id: 'custom-search',
        name: 'Custom Search',
        description: 'Connect to your own search endpoint or alternative provider.',
        icon: '🌐',
        placeholder: 'https://api.yourprovider.com',
        models: ['JSON', 'XML', 'RSS']
    }
];

const CredentialsPage: React.FC = () => {
    const [providers, setProviders] = useState<ApiKeyConfig[]>(INITIAL_PROVIDERS);
    const [selectedProviderId, setSelectedProviderId] = useState(providers[0].id);
    const [selectedWebToolId, setSelectedWebToolId] = useState(WEB_TOOLS[0].id);
    const [selectedSearchToolId, setSelectedSearchToolId] = useState(SEARCH_TOOLS[0].id);
    const [keys, setKeys] = useState<Record<string, string>>({});
    const [models, setModels] = useState<Record<string, string>>({});
    const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});

    // Custom Provider Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProvider, setNewProvider] = useState({ name: '', icon: '🌐', description: '', placeholder: '', models: '' });

    const selectedProvider = providers.find(p => p.id === selectedProviderId) || providers[0];
    const selectedWebTool = WEB_TOOLS.find(t => t.id === selectedWebToolId) || WEB_TOOLS[0];
    const selectedSearchTool = SEARCH_TOOLS.find(t => t.id === selectedSearchToolId) || SEARCH_TOOLS[0];

    const handleKeyChange = (id: string, value: string) => {
        setKeys(prev => ({ ...prev, [id]: value }));
    };

    const handleModelChange = (id: string, value: string) => {
        setModels(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = async (id: string) => {
        try {
            const apiKey = keys[id] || '';
            const model = models[id] || '';

            // Determine which category this belongs to
            let updateData: any = {};

            if (['openai', 'anthropic', 'google', 'ollama', 'lmstudio'].includes(id)) {
                updateData.llmProvider = {
                    selectedProvider: id,
                    apiKey: apiKey,
                    model: model
                };
            } else if (['firecrawl', 'crawl4ai', 'spider'].includes(id)) {
                updateData.webTools = {
                    selectedTool: id,
                    apiKey: apiKey,
                    mode: model || 'Standard'
                };
            } else if (['serper', 'duckduckgo', 'custom-search'].includes(id)) {
                updateData.searchTools = {
                    selectedProvider: id,
                    apiKey: apiKey,
                    mode: model || 'Search'
                };
            }

            await credentialsService.updateCredentials(updateData);
            setSavedStatus(prev => ({ ...prev, [id]: true }));
            alert(`${id} configuration saved successfully!`);
        } catch (error) {
            console.error('Failed to save credentials:', error);
            alert('Failed to save configuration. Please try again.');
        }
    };

    const handleAddCustomProvider = () => {
        const id = newProvider.name.toLowerCase().replace(/\s+/g, '-');
        const provider: ApiKeyConfig = {
            id,
            name: newProvider.name,
            icon: newProvider.icon,
            description: newProvider.description || 'Custom LLM Provider',
            placeholder: newProvider.placeholder || 'API Key or Endpoint',
            models: newProvider.models ? newProvider.models.split(',').map(m => m.trim()) : ['default-model']
        };

        setProviders(prev => [...prev, provider]);
        setSelectedProviderId(id);
        setIsModalOpen(false);
        setNewProvider({ name: '', icon: '🌐', description: '', placeholder: '', models: '' });
    };

    return (
        <div className="credentials-container">
            <div className="credentials-header">
                <h1>Credentials</h1>
                <p className="credentials-description">
                    Configure your LLM providers, Web Scraping, and Search tools to power your stock research assistant.
                </p>
            </div>

            <div className="api-section">
                {/* LLM Providers Section */}
                <div className="api-card">
                    <div className="api-card-header" style={{ marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>LLM Providers</h2>
                    </div>
                    <div className="input-group" style={{ marginBottom: '24px' }}>
                        <label className="input-label">Select LLM Provider</label>
                        <select
                            className="api-input"
                            value={selectedProviderId}
                            onChange={(e) => setSelectedProviderId(e.target.value)}
                            style={{ width: '100%', fontSize: '1rem', fontWeight: 600 }}
                        >
                            {providers.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.icon} {p.name} {p.id === 'ollama' || p.id === 'lmstudio' ? '(LOCAL)' : ''}
                                </option>
                            ))}
                        </select>
                        <button className="btn-secondary add-provider-btn" onClick={() => setIsModalOpen(true)}>
                            <span>+</span> Add Custom Provider
                        </button>
                    </div>

                    <div className="provider-config-area" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                        <div className="api-card-title">
                            <span className="api-icon">{selectedProvider.icon}</span>
                            <span>{selectedProvider.name} Configuration</span>
                            {(selectedProvider.id === 'ollama' || selectedProvider.id === 'lmstudio') && (
                                <span className="local-badge">Local</span>
                            )}
                        </div>
                        <p className="stat-label" style={{ marginBottom: '20px', display: 'block' }}>
                            {selectedProvider.description}
                        </p>

                        <div className="input-group" style={{ marginBottom: '16px' }}>
                            <label className="input-label">Preferred Model</label>
                            <select
                                className="api-input"
                                value={models[selectedProviderId] || selectedProvider.models[0]}
                                onChange={(e) => handleModelChange(selectedProviderId, e.target.value)}
                                style={{ width: '100%', fontFamily: 'inherit' }}
                            >
                                {selectedProvider.models.map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">
                                {selectedProvider.id === 'ollama' || selectedProvider.id === 'lmstudio' ? 'Server Endpoint' : 'API Key'}
                            </label>
                            <div className="api-input-wrapper">
                                <input
                                    type={selectedProvider.id === 'ollama' || selectedProvider.id === 'lmstudio' ? 'text' : 'password'}
                                    className="api-input"
                                    placeholder={selectedProvider.placeholder}
                                    value={keys[selectedProviderId] || ''}
                                    onChange={(e) => handleKeyChange(selectedProviderId, e.target.value)}
                                />
                                <button
                                    className="save-key-btn"
                                    onClick={() => handleSave(selectedProviderId)}
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        {savedStatus[selectedProviderId] && (
                            <div className="api-status">
                                <span className="status-indicator status-active"></span>
                                <span style={{ color: '#059669', fontWeight: 600 }}>Configured</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Web Scraping Tools Section */}
                <div className="api-card">
                    <div className="api-card-header" style={{ marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Web Scraping & Crawling</h2>
                    </div>
                    <div className="input-group" style={{ marginBottom: '24px' }}>
                        <label className="input-label">Select Web Tool</label>
                        <select
                            className="api-input"
                            value={selectedWebToolId}
                            onChange={(e) => setSelectedWebToolId(e.target.value)}
                            style={{ width: '100%', fontSize: '1rem', fontWeight: 600 }}
                        >
                            {WEB_TOOLS.map(t => (
                                <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="provider-config-area" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                        <div className="api-card-title">
                            <span className="api-icon">{selectedWebTool.icon}</span>
                            <span>{selectedWebTool.name} Configuration</span>
                        </div>
                        <p className="stat-label" style={{ marginBottom: '20px', display: 'block' }}>
                            {selectedWebTool.description}
                        </p>

                        <div className="input-group" style={{ marginBottom: '16px' }}>
                            <label className="input-label">Scraping Mode</label>
                            <select
                                className="api-input"
                                value={models[selectedWebToolId] || selectedWebTool.models[0]}
                                onChange={(e) => handleModelChange(selectedWebToolId, e.target.value)}
                                style={{ width: '100%', fontFamily: 'inherit' }}
                            >
                                {selectedWebTool.models.map(mode => (
                                    <option key={mode} value={mode}>{mode}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">API Key</label>
                            <div className="api-input-wrapper">
                                <input
                                    type="password"
                                    className="api-input"
                                    placeholder={selectedWebTool.placeholder}
                                    value={keys[selectedWebToolId] || ''}
                                    onChange={(e) => handleKeyChange(selectedWebToolId, e.target.value)}
                                />
                                <button
                                    className="save-key-btn"
                                    onClick={() => handleSave(selectedWebToolId)}
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        {savedStatus[selectedWebToolId] && (
                            <div className="api-status">
                                <span className="status-indicator status-active"></span>
                                <span style={{ color: '#059669', fontWeight: 600 }}>Tool Enabled</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search APIs Section */}
                <div className="api-card">
                    <div className="api-card-header" style={{ marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Search & Intelligence</h2>
                    </div>
                    <div className="input-group" style={{ marginBottom: '24px' }}>
                        <label className="input-label">Select Search Provider</label>
                        <select
                            className="api-input"
                            value={selectedSearchToolId}
                            onChange={(e) => setSelectedSearchToolId(e.target.value)}
                            style={{ width: '100%', fontSize: '1rem', fontWeight: 600 }}
                        >
                            {SEARCH_TOOLS.map(t => (
                                <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="provider-config-area" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                        <div className="api-card-title">
                            <span className="api-icon">{selectedSearchTool.icon}</span>
                            <span>{selectedSearchTool.name} Configuration</span>
                        </div>
                        <p className="stat-label" style={{ marginBottom: '20px', display: 'block' }}>
                            {selectedSearchTool.description}
                        </p>

                        <div className="input-group" style={{ marginBottom: '16px' }}>
                            <label className="input-label">Search Mode</label>
                            <select
                                className="api-input"
                                value={models[selectedSearchToolId] || selectedSearchTool.models[0]}
                                onChange={(e) => handleModelChange(selectedSearchToolId, e.target.value)}
                                style={{ width: '100%', fontFamily: 'inherit' }}
                            >
                                {selectedSearchTool.models.map(mode => (
                                    <option key={mode} value={mode}>{mode}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">
                                {selectedSearchTool.id === 'custom-search' ? 'Endpoint URL' : 'API Key'}
                            </label>
                            <div className="api-input-wrapper">
                                <input
                                    type={selectedSearchTool.id === 'custom-search' ? 'text' : 'password'}
                                    className="api-input"
                                    placeholder={selectedSearchTool.placeholder}
                                    value={keys[selectedSearchToolId] || ''}
                                    onChange={(e) => handleKeyChange(selectedSearchToolId, e.target.value)}
                                />
                                <button
                                    className="save-key-btn"
                                    onClick={() => handleSave(selectedSearchToolId)}
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        {savedStatus[selectedSearchToolId] && (
                            <div className="api-status">
                                <span className="status-indicator status-active"></span>
                                <span style={{ color: '#059669', fontWeight: 600 }}>Search Enabled</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Provider Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Add Custom LLM Provider</h2>
                        </div>
                        <div className="api-section">
                            <div className="input-group">
                                <label className="input-label">Provider Name</label>
                                <input
                                    className="api-input"
                                    placeholder="e.g., Together AI"
                                    value={newProvider.name}
                                    onChange={e => setNewProvider({ ...newProvider, name: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Available Models (comma separated)</label>
                                <input
                                    className="api-input"
                                    placeholder="model-1, model-2"
                                    value={newProvider.models}
                                    onChange={e => setNewProvider({ ...newProvider, models: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Base URL / Endpoint (Optional)</label>
                                <input
                                    className="api-input"
                                    placeholder="https://api.provider.com/v1"
                                    value={newProvider.placeholder}
                                    onChange={e => setNewProvider({ ...newProvider, placeholder: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button
                                className="save-key-btn"
                                onClick={handleAddCustomProvider}
                                disabled={!newProvider.name}
                            >
                                Add Provider
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="security-note">
                <div className="security-icon">🔒</div>
                <div className="security-text">
                    <h4>Security Note</h4>
                    <p>
                        Your API keys are stored securely. For local LLMs, ensure the server (Ollama/LM Studio) is accessible from your browser.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CredentialsPage;
