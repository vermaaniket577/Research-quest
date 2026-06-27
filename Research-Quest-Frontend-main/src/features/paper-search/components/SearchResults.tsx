'use client';

import React from 'react';
import { Paper } from '@/types/paper';
import PaperCard from './PaperCard';
import PaperDetail from './PaperDetail';
import SimilarPapers from './SimilarPapers';
import EmptyState from './EmptyState';
import { PaperCardSkeleton } from '@/components/ui/skeleton';
import Button from '@/components/ui/button';
import './SearchResults.css';

interface SearchResultsProps {
  papers: Paper[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  selectedPaper: Paper | null;
  similarPapers: Paper[];
  onViewPaper: (paper: Paper) => void;
  onCloseDetail: () => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}

export default function SearchResults({
  papers,
  total,
  page,
  totalPages,
  isLoading,
  error,
  hasSearched,
  selectedPaper,
  similarPapers,
  onViewPaper,
  onCloseDetail,
  onPageChange,
  onRetry,
}: SearchResultsProps) {
  if (!hasSearched) {
    return null;
  }

  if (error) {
    return (
      <EmptyState
        type="error"
        description={error}
        actionLabel="Try Again"
        onAction={onRetry}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="search-results-loading">
        <div className="search-results-loading-header">
          <div className="search-results-loading-bar" />
        </div>
        <div className="search-results-loading-grid">
          {[1, 2, 3, 4, 5].map((i) => (
            <PaperCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <EmptyState
        type="no-results"
        actionLabel="Try Deep Search"
        onAction={onRetry}
      />
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-results-header">
        <p className="search-results-count">
          Found <span className="search-results-count-highlight">{total}</span> papers
          {page > 0 && totalPages > 0 && (
            <> · Page <span className="search-results-count-highlight">{page}</span> of <span className="search-results-count-highlight">{totalPages}</span></>
          )}
        </p>
      </div>

      <div className="search-results-layout">
        <div className={`${selectedPaper ? 'search-results-list-with-detail' : 'search-results-list-full'} search-results-list`}>
          {papers.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              isSelected={selectedPaper?.id === paper.id}
              onSelect={onViewPaper}
            />
          ))}

          {totalPages > 1 && (
            <div className="search-results-pagination">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
              >
                <svg className="search-results-pagination-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Button>
              
              {generatePageNumbers(page, totalPages).map((pageNum, index) => (
                pageNum === '...' ? (
                  <span key={`ellipsis-${index}`} className="search-results-pagination-ellipsis">...</span>
                ) : (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(pageNum as number)}
                    className="search-results-page-btn"
                  >
                    {pageNum}
                  </Button>
                )
              ))}

              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
              >
                Next
                <svg className="search-results-pagination-icon-right" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          )}
        </div>

        {selectedPaper && (
          <div className="search-results-sidebar">
            <PaperDetail paper={selectedPaper} onClose={onCloseDetail} />
            {similarPapers.length > 0 && (
              <SimilarPapers papers={similarPapers} onSelect={onViewPaper} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function generatePageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [1];

  if (current > 3) {
    pages.push('...');
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('...');
  }

  pages.push(total);

  return pages;
}