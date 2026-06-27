'use client';

import React from 'react';
import Button from '@/components/ui/button';
import './EmptyState.css';

interface EmptyStateProps {
  type: 'initial' | 'no-results' | 'error';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ type, title, description, actionLabel, onAction }: EmptyStateProps) {
  const config = {
    initial: {
      icon: (
        <svg className="empty-state-icon-svg empty-state-icon-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: title || 'Search Research Papers',
      description: description || 'Enter a paper title or use deep search to find relevant academic papers across multiple databases.',
    },
    'no-results': {
      icon: (
        <svg className="empty-state-icon-svg empty-state-icon-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
      ),
      title: title || 'No Papers Found',
      description: description || 'We couldn\'t find any papers matching your search. Try adjusting your search terms or use deep search for better results.',
    },
    error: {
      icon: (
        <svg className="empty-state-icon-svg empty-state-icon-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      title: title || 'Something Went Wrong',
      description: description || 'An error occurred while searching. Please check your connection and try again.',
    },
  };

  const current = config[type];

  return (
    <div className="empty-state-container">
      <div className="empty-state-icon">{current.icon}</div>
      <h3 className="empty-state-title">{current.title}</h3>
      <p className="empty-state-description">{current.description}</p>
      {actionLabel && onAction && (
        <div className="empty-state-action">
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}