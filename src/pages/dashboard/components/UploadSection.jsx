import React, { useRef, useCallback, useState } from 'react';
import { UploadIcon } from './Icons';

const UploadSection = ({ onFilesUploaded, isUploading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/')
      );

      if (files.length === 0) {
        onFilesUploaded(null, 'Please drop image files only');
        return;
      }

      await onFilesUploaded(files);
    },
    [onFilesUploaded]
  );

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (files.length === 0) {
      onFilesUploaded(null, 'Please select image files only');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    await onFilesUploaded(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section className="upload-section">
      <div
        className={`upload-zone ${isDragging ? 'drag-active' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <h2 className="upload-title">Upload Photos </h2>
        <span className="upload-icon">
          <UploadIcon />
        </span>
        <p className="upload-text">
          Drag & drop your photos here, or{' '}
          <span className="upload-browse">browse files</span>
        </p>
        <p className="upload-hint">Supports: JPG, PNG, GIF, WebP</p>
        {isUploading && (
          <div className="upload-progress">
            <div className="spinner"></div>
            <span>Uploading...</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default UploadSection;