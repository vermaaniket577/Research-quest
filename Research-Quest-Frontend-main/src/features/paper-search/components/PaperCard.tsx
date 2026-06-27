'use client';

import React from 'react';
import { Paper } from '@/types/paper';
import Card, { CardContent } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import './PaperCard.css';

interface PaperCardProps {
  paper: Paper;
  isSelected: boolean;
  onSelect: (paper: Paper) => void;
}

export default function PaperCard({ paper, isSelected, onSelect }: PaperCardProps) {
  const truncateAbstract = (text: string, maxLength: number = 200) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card
      hoverable
      className={`${isSelected ? 'paper-card-selected' : ''}`}
      onClick={() => onSelect(paper)}
    >
      <CardContent className="paper-card-content">
        <h3 className="paper-card-title">
          {paper.title}
        </h3>
        
        <p className="paper-card-authors">
          {Array.isArray(paper.authors)
            ? paper.authors.slice(0, 3).join(', ') + (paper.authors.length > 3 ? ' et al.' : '')
            : (typeof paper.authors === 'string' ? paper.authors : '')}
        </p>

        <div className="paper-card-meta">
          {paper.journal && (
            <span className="paper-card-meta-icon">
              <svg className="paper-card-meta-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              {paper.journal}
            </span>
          )}
          {paper.publicationYear && (
            <span className="paper-card-meta-icon">
              <svg className="paper-card-meta-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {paper.publicationYear}
            </span>
          )}
          {paper.doi && (
            <span className="paper-card-doi">
              <svg className="paper-card-meta-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              DOI: {paper.doi.length > 20 ? paper.doi.substring(0, 20) + '...' : paper.doi}
            </span>
          )}
          {paper.relevanceScore !== undefined && (
            <Badge variant="success">
              {Math.round(paper.relevanceScore * 100)}% match
            </Badge>
          )}
        </div>

        {paper.abstract && (
          <p className="paper-card-abstract">
            {truncateAbstract(paper.abstract)}
          </p>
        )}

        {paper.keywords && paper.keywords.length > 0 && (
          <div className="paper-card-keywords">
            {paper.keywords.slice(0, 5).map((keyword, index) => (
              <Badge key={index} variant="primary" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {paper.keywords.length > 5 && (
              <Badge variant="default" className="text-xs">
                +{paper.keywords.length - 5} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}