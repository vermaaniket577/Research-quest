'use client';

import React from 'react';
import { Paper } from '@/types/paper';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import './PaperDetail.css';

interface PaperDetailProps {
  paper: Paper;
  onClose: () => void;
}

export default function PaperDetail({ paper, onClose }: PaperDetailProps) {
  return (
    <div className="paper-detail-container">
      <div className="paper-detail-header">
        <div className="paper-detail-header-content">
          <div className="paper-detail-badge-row">
            <span className="paper-detail-label">Paper Details</span>
            {paper.relevanceScore !== undefined && (
              <Badge variant="success">{Math.round(paper.relevanceScore * 100)}% relevance</Badge>
            )}
          </div>
          <h2 className="paper-detail-title">{paper.title}</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close paper details"
          className="paper-detail-close-btn"
        >
          <svg className="paper-detail-close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="paper-detail-grid">
        <div>
          <h4 className="paper-detail-field-label">Authors</h4>
          <p className="paper-detail-field-value">
            {Array.isArray(paper.authors) 
              ? paper.authors.join(', ') 
              : (typeof paper.authors === 'string' ? paper.authors : 'N/A')}
          </p>
        </div>
        <div>
          <h4 className="paper-detail-field-label">Journal / Conference</h4>
          <p className="paper-detail-field-value">{paper.journal || 'N/A'}</p>
        </div>
        <div>
          <h4 className="paper-detail-field-label">Publication Year</h4>
          <p className="paper-detail-field-value">{paper.publicationYear || 'N/A'}</p>
        </div>
        <div>
          <h4 className="paper-detail-field-label">DOI</h4>
          {paper.doi ? (
            <a
              href={`https://doi.org/${paper.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="paper-detail-link"
            >
              {paper.doi}
            </a>
          ) : (
            <p className="paper-detail-na">N/A</p>
          )}
        </div>
        {paper.publisher && (
          <div>
            <h4 className="paper-detail-field-label">Publisher</h4>
            <p className="paper-detail-field-value">{paper.publisher}</p>
          </div>
        )}
        {paper.citations !== undefined && (
          <div>
            <h4 className="paper-detail-field-label">Citations</h4>
            <p className="paper-detail-field-value">{paper.citations.toLocaleString()}</p>
          </div>
        )}
      </div>

      {paper.abstract && (
        <div className="paper-detail-section">
          <h4 className="paper-detail-section-title">Abstract</h4>
          <p className="paper-detail-abstract-text">{paper.abstract}</p>
        </div>
      )}

      {paper.keywords && paper.keywords.length > 0 && (
        <div className="paper-detail-section">
          <h4 className="paper-detail-section-title">Keywords</h4>
          <div className="paper-detail-keywords">
            {paper.keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="paper-detail-actions">
        {paper.doi && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`https://doi.org/${paper.doi}`, '_blank')}
          >
            <svg className="paper-detail-action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open Paper
          </Button>
        )}
        {paper.url && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(paper.url, '_blank')}
          >
            <svg className="paper-detail-action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            View Source
          </Button>
        )}
      </div>
    </div>
  );
}