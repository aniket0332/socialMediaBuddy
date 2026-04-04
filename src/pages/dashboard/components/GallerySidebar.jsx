import React from 'react';
import { GalleryIcon, GenerateIcon, CheckIcon, CloseIcon } from './Icons';

const GallerySidebar = ({
  galleryImages,
  selectedImages,
  onToggleSelect,
  onRemoveImage,
  onGenerate,
  isGenerating,
}) => {
  const isSelectionFull = selectedImages.length >= 5;

  return (
    <aside className="gallery-sidebar">
      <div className="gallery-header">
        <h2>Gallery</h2>
        <span className="selection-count">
          {selectedImages.length}/5 selected
        </span>
      </div>

      {galleryImages.length === 0 ? (
        <div className="gallery-empty">
          <GalleryIcon />
          <p>No photos uploaded yet</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {galleryImages.map((imageUrl, index) => (
            <div
              key={`${imageUrl}-${index}`}
              className={`gallery-item ${
                selectedImages.includes(imageUrl) ? 'selected' : ''
              } ${isSelectionFull && !selectedImages.includes(imageUrl) ? 'disabled' : ''}`}
              onClick={() => onToggleSelect(imageUrl)}
            >
              <img src={imageUrl} alt={`Gallery ${index + 1}`} />
              <div className="gallery-item-overlay">
                {selectedImages.includes(imageUrl) && (
                  <CheckIcon className="check-icon" />
                )}
              </div>
              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveImage(imageUrl);
                }}
                title="Remove"
              >
                <CloseIcon className="close-icon" />
              </button>
            </div>
          ))}
        </div>
      )}

      {galleryImages.length > 0 && (
        <div className="generate-section">
          <button
            className={`btn btn-primary generate-btn ${
              selectedImages.length === 0 ? 'disabled' : ''
            }`}
            onClick={onGenerate}
            disabled={selectedImages.length === 0 || isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="spinner-small"></div>
                Generating...
              </>
            ) : (
              <>
                <GenerateIcon />
                Generate Posts
              </>
            )}
          </button>
          <p className="generate-hint">Select 1-5 photos to generate suggestions</p>
        </div>
      )}
    </aside>
  );
};

export default GallerySidebar;