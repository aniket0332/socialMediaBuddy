import React from 'react';

const AnalysisPopover = ({ analysis }) => {
  return (
    <div className="analysis-popover">
      <h4>📊 Image Analysis</h4>
      <div className="analysis-grid">
        <div className="analysis-item">
          <span className="analysis-label">Clarity</span>
          <div className="analysis-bar">
            <div
              className="analysis-fill"
              style={{ width: `${analysis.clarity * 10}%` }}
            />
          </div>
          <span className="analysis-value">{analysis.clarity}/10</span>
        </div>
        <div className="analysis-item">
          <span className="analysis-label">Scenic Beauty</span>
          <div className="analysis-bar">
            <div
              className="analysis-fill"
              style={{ width: `${analysis.scenic_beauty * 10}%` }}
            />
          </div>
          <span className="analysis-value">{analysis.scenic_beauty}/10</span>
        </div>
        <div className="analysis-item">
          <span className="analysis-label">Vibrant Colors</span>
          <div className="analysis-bar">
            <div
              className="analysis-fill"
              style={{ width: `${analysis.vibrant_colors * 10}%` }}
            />
          </div>
          <span className="analysis-value">{analysis.vibrant_colors}/10</span>
        </div>
      </div>
      <p className="vibe-text">
        <strong>Vibe:</strong> {analysis.vibe}
      </p>
    </div>
  );
};

export default AnalysisPopover;