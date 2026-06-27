'use client';

import React from 'react';
import { Paper } from '@/types/paper';
import Badge from '@/components/ui/badge';
import './SimilarPapers.css';

interface SimilarPapersProps {
  papers: Paper[];
  onSelect: (paper: Paper) => void;
  isLoading?: boolean;
}

export default function SimilarPapers({ papers, onSelect, isLoading }: SimilarPapersProps) {
  if (isLoading) {
    return (
      <div className="similar-papers-container">
        <h3 className="similar-papers-title">Similar Papers</h3>
        <div className="similar-papers-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="similar-papers-skeleton">
              <div className="similar-papers-skeleton-line w-3/4 mb-2" />
              <div className="similar-papers-skeleton-line-short w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (papers.length === 0) {
    return null;
  }

  return (
    <div className="similar-papers-container">
      <h3 className="similar-papers-title">
        Similar Papers ({papers.length})
      </h3>
      <div className="similar-papers-list">
        {papers.slice(0, 5).map((paper) => (
          <button
            key={paper.id}
            onClick={() => onSelect(paper)}
            className="similar-papers-item"
          >
            <p className="similar-papers-item-title">
              {paper.title}
            </p>
            <p className="similar-papers-item-meta">
              {Array.isArray(paper.authors)
                ? paper.authors.slice(0, 2).join(', ') + (paper.authors.length > 2 ? ' et al.' : '') + ' · '
                : (typeof paper.authors === 'string' && paper.authors ? paper.authors + ' · ' : '')}
              {paper.publicationYear}
            </p>
            {paper.relevanceScore !== undefined && (
              <div className="similar-papers-item-badge">
                <Badge variant="success" className="similar-papers-badge-text">
                  {Math.round(paper.relevanceScore * 100)}% similar
                </Badge>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}