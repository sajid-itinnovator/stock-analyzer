import React, { useState } from 'react';

const RiskSlider: React.FC = () => {
    const [riskLevel, setRiskLevel] = useState(50);

    const getRiskLabel = (level: number) => {
        if (level < 33) return 'Conservative';
        if (level < 66) return 'Moderate';
        return 'Aggressive';
    };

    return (
        <div className="settings-card risk-profile-card">
            <div className="card-header">Risk Profile</div>
            <div className="card-body">
                <p className="risk-description">
                    Adjust your investment style to tailor AI stock recommendations.
                </p>
                <div className="risk-slider-container">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={riskLevel}
                        onChange={(e) => setRiskLevel(parseInt(e.target.value))}
                        className="risk-range-slider"
                    />
                    <div className="risk-labels">
                        <span>Conservative</span>
                        <span>Moderate</span>
                        <span>Aggressive</span>
                    </div>
                </div>
                <div className="current-risk-display">
                    Current Style: <strong>{getRiskLabel(riskLevel)}</strong>
                </div>
            </div>
        </div>
    );
};

export default RiskSlider;
