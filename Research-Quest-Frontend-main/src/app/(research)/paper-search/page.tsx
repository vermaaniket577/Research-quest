'use client';

import React, { useCallback } from 'react';
import { usePaperSearch } from '@/features/paper-search/hooks/use-paper-search';
import SearchForm from '@/features/paper-search/components/SearchForm';
import SearchResults from '@/features/paper-search/components/SearchResults';
import EmptyState from '@/features/paper-search/components/EmptyState';

export default function PaperSearchPage() {
  const {
    papers,
    total,
    page,
    totalPages,
    isLoading,
    error,
    searchMode,
    query,
    deepSearchParams,
    similarPapers,
    selectedPaper,
    setSearchMode,
    setQuery,
    setDeepSearchParams,
    handleSimpleSearch,
    handleDeepSearch,
    handleViewPaper,
    handleCloseDetail,
    handlePageChange,
  } = usePaperSearch();

  const hasSearched = papers.length > 0 || error !== null || (searchMode === 'simple' && query !== '');

  const handleRetry = useCallback(() => {
    if (searchMode === 'simple') {
      handleSimpleSearch();
    } else {
      handleDeepSearch();
    }
  }, [searchMode, handleSimpleSearch, handleDeepSearch]);

  return (
    <div className="research-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">ResearchQuest</div>
        <div className="nav-user">
          <a
            href="/login"
            className="text-white text-sm font-medium hover:text-gray-200 transition-colors"
          >
            Sign In
          </a>
          <a
            href="/register"
            className="px-4 py-1.5 bg-white text-blue-600 rounded-md text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            Sign Up
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="research-container">
        {/* Header */}
        <div className="research-header">
          <h1>Research Paper Searcher</h1>
          <p>
            Discover academic papers across multiple research databases. 
            Use simple search for quick results or deep search for semantic discovery.
          </p>
        </div>

        {/* Search Form */}
        <SearchForm
          searchMode={searchMode}
          query={query}
          deepSearchParams={deepSearchParams}
          isLoading={isLoading}
          onSearchModeChange={setSearchMode}
          onQueryChange={setQuery}
          onDeepSearchParamsChange={setDeepSearchParams}
          onSimpleSearch={handleSimpleSearch}
          onDeepSearch={handleDeepSearch}
        />

        {/* Initial State (no search performed yet) */}
        {!hasSearched && !isLoading && (
          <EmptyState type="initial" />
        )}

        {/* Search Results */}
        <SearchResults
          papers={papers}
          total={total}
          page={page}
          totalPages={totalPages}
          isLoading={isLoading}
          error={error}
          hasSearched={hasSearched}
          selectedPaper={selectedPaper}
          similarPapers={similarPapers}
          onViewPaper={handleViewPaper}
          onCloseDetail={handleCloseDetail}
          onPageChange={handlePageChange}
          onRetry={handleRetry}
        />
      </div>
    </div>
  );
}