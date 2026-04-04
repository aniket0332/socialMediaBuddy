import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { logout } from '../../utils/auth';
import { getfiles } from '../../services/content.service';
import { generatePost } from '../../services/agent.service';
import { apiPost } from '../../services/apiClient';
import { API_ENDPOINTS } from '../../config/api.config';
import { EmptyStateIcon } from './components/Icons';
import UploadSection from './components/UploadSection';
import GallerySidebar from './components/GallerySidebar';
import PostCard from './components/PostCard';
import './dashboard.css';

const Dashboard = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [generatedPosts, setGeneratedPosts] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGeneratedPosts, setShowGeneratedPosts] = useState(false);
  const [captionIndices, setCaptionIndices] = useState({});

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const data = await getfiles();
      setGalleryImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleFilesUploaded = async (files, errorMessage) => {
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrls = [];

      for (const file of files) {
        try {
          const res = await apiPost(API_ENDPOINTS.PUT_FILE, {
            fileName: file.name,
            fileType: file.type,
          });

          const { uploadUrl, fileUrl } = res;

          const uploadRes = await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type },
            body: file,
          });

          if (uploadRes.ok) {
            uploadedUrls.push(fileUrl);
          } else {
            toast.error(`Failed to upload ${file.name}`);
          }
        } catch (error) {
          console.error('Upload error:', error);
          toast.error(`Error uploading ${file.name}`);
        }
      }

      if (uploadedUrls.length > 0) {
        setGalleryImages((prev) => [...prev, ...uploadedUrls]);
        toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      if (error.message.includes('Unauthorized')) logout();
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleImageSelection = (imageUrl) => {
    setSelectedImages((prev) => {
      if (prev.includes(imageUrl)) {
        return prev.filter((url) => url !== imageUrl);
      }
      if (prev.length >= 5) {
        toast.warning('You can select at most 5 images');
        return prev;
      }
      return [...prev, imageUrl];
    });
  };

  const removeImage = (imageUrl) => {
    setGalleryImages((prev) => prev.filter((url) => url !== imageUrl));
    setSelectedImages((prev) => prev.filter((url) => url !== imageUrl));
  };

  const generatePosts = async () => {
    if (selectedImages.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await generatePost({ image_urls: selectedImages });

      if (response.results) {
        setGeneratedPosts(response.results);
        setShowGeneratedPosts(true);
        const indices = {};
        response.results.forEach((_, idx) => {
          indices[idx] = 0;
        });
        setCaptionIndices(indices);
        toast.success('Posts generated successfully!');
      } else {
        toast.error('Failed to generate posts');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate posts. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const cycleCaption = (postIndex) => {
    setCaptionIndices((prev) => {
      const post = generatedPosts[postIndex];
      const currentIdx = prev[postIndex] || 0;
      const nextIdx = (currentIdx + 1) % post.captions.length;
      return { ...prev, [postIndex]: nextIdx };
    });
  };

  return (
    <div className="dashboard-container">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>📸 Content Suggestor</h1>
            <p>Upload your photos and get AI-powered post suggestions</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-logout" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-layout">
          {/* Left Sidebar - Upload + Gallery */}
          <aside className="left-sidebar">
            <UploadSection
              onFilesUploaded={handleFilesUploaded}
              isUploading={isUploading}
            />
            <GallerySidebar
              galleryImages={galleryImages}
              selectedImages={selectedImages}
              onToggleSelect={toggleImageSelection}
              onRemoveImage={removeImage}
              onGenerate={generatePosts}
              isGenerating={isGenerating}
            />
          </aside>

          {/* Right Content - Posts */}
          <section className="posts-section">
            {!showGeneratedPosts ? (
              <div className="posts-empty">
                <EmptyStateIcon />
                <h3>No suggestions yet</h3>
                <p>
                  Upload photos, select the ones you want to post, and click
                  "Generate Posts" to get AI-powered suggestions with captions,
                  hashtags, and music recommendations.
                </p>
              </div>
            ) : (
              <div className="posts-container">
                <h2>Generated Suggestions</h2>
                <div className="posts-grid">
                  {generatedPosts.map((post, index) => (
                    <PostCard
                      key={index}
                      post={post}
                      imageUrl={selectedImages[post.image_index - 1]}
                      captionIndex={captionIndices[index] || 0}
                      onCycleCaption={() => cycleCaption(index)}
                      onCopy={copyToClipboard}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;