import React from 'react';
import AnalysisPopover from './AnalysisPopover';
import { MusicIcon, InfoIcon, CopyIcon } from './Icons';

const PostCard = ({ post, imageUrl, captionIndex, onCycleCaption, onCopy }) => {
  const currentCaption = post.captions[captionIndex];
  const totalCaptions = post.captions.length;

  return (
    <div className="post-card">
      {/* Song Bar - Top of post */}
      <div className="post-song-bar">
        <div className="song-icon-small">
          <MusicIcon />
        </div>
        <span className="song-text">
          {post.song.title} — {post.song.artist}
        </span>
      </div>

      {/* Image */}
      <div className="post-image">
        <img src={imageUrl} alt={`Post ${post.image_index}`} />
      </div>

      {/* Actions Bar */}
      <div className="post-actions">
        <button className="action-btn" title="View Analysis">
          <InfoIcon />
        </button>
        <AnalysisPopover analysis={post.analysis} />
        <button
          className="action-btn"
          onClick={() => onCopy(currentCaption)}
          title="Copy caption"
        >
          <CopyIcon />
        </button>
      </div>

      {/* Caption */}
      <div className="post-caption-area">
        <p className="post-caption" onClick={() => onCycleCaption()}>
          {currentCaption}
          {totalCaptions > 1 && (
            <span className="caption-hint">
              {' '}
              ({captionIndex + 1}/{totalCaptions})
            </span>
          )}
        </p>
      </div>

      {/* Hashtags */}
      <div className="post-hashtags-inline">
        {post.hashtags.map((hashtag, index) => (
          <span key={index} className="hashtag-inline">
            {hashtag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PostCard;