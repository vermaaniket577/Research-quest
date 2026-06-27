'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Tabs from '@/components/ui/tabs';
import "./SearchForm.css";

interface SearchFormProps {
  searchMode: 'simple' | 'deep';
  query: string;
  deepSearchParams: {
    subject: string;
    specialization: string;
    keywords: string;
  };
  isLoading: boolean;
  onSearchModeChange: (mode: 'simple' | 'deep') => void;
  onQueryChange: (query: string) => void;
  onDeepSearchParamsChange: (params: { subject: string; specialization: string; keywords: string }) => void;
  onSimpleSearch: () => void;
  onDeepSearch: () => void;
}

export default function SearchForm({
  searchMode,
  query,
  deepSearchParams,
  isLoading,
  onSearchModeChange,
  onQueryChange,
  onDeepSearchParamsChange,
  onSimpleSearch,
  onDeepSearch,
}: SearchFormProps) {
  const [localQuery, setLocalQuery] = useState(query);
  const [localDeepParams, setLocalDeepParams] = useState(deepSearchParams);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  useEffect(() => {
    setLocalDeepParams(deepSearchParams);
  }, [deepSearchParams]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
    onQueryChange(e.target.value);
  };

  const handleDeepParamChange = (field: string, value: string) => {
    const updated = { ...localDeepParams, [field]: value };
    setLocalDeepParams(updated);
    onDeepSearchParamsChange(updated);
  };

  const handleSimpleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      onQueryChange(localQuery.trim());
      onSimpleSearch();
    }
  };

  const handleDeepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localDeepParams.keywords.trim()) {
      onDeepSearchParamsChange(localDeepParams);
      onDeepSearch();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (searchMode === 'simple') {
        handleSimpleSubmit(e);
      } else {
        handleDeepSubmit(e);
      }
    }
  };

  return (
    <div className="search-form-container">
      <Tabs
        tabs={[
          { id: 'simple', label: 'Simple Search' },
          { id: 'deep', label: 'Deep Search' },
        ]}
        activeTab={searchMode}
        onTabChange={(tabId) => onSearchModeChange(tabId as 'simple' | 'deep')}
        className="mb-4"
      />

      {searchMode === 'simple' ? (
        <form onSubmit={handleSimpleSubmit}>
          <div className="search-form-row">
            <div className="search-form-input-wrapper">
              <Input
                placeholder="Search by paper title, keywords, or research subject..."
                value={localQuery}
                onChange={handleQueryChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" isLoading={isLoading} disabled={!localQuery.trim()}>
              <svg className="search-form-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleDeepSubmit} className="space-y-4">
          <div className="search-form-deep-grid">
            <Input
              label="Subject"
              placeholder="e.g., Computer Science"
              value={localDeepParams.subject}
              onChange={(e) => handleDeepParamChange('subject', e.target.value)}
              disabled={isLoading}
            />
            <Input
              label="Specialization"
              placeholder="e.g., Machine Learning"
              value={localDeepParams.specialization}
              onChange={(e) => handleDeepParamChange('specialization', e.target.value)}
              disabled={isLoading}
            />
            <Input
              label="Keywords"
              placeholder="e.g., neural networks, deep learning"
              value={localDeepParams.keywords}
              onChange={(e) => handleDeepParamChange('keywords', e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="search-form-submit-row">
            <Button type="submit" isLoading={isLoading} disabled={!localDeepParams.keywords.trim()}>
              <svg className="search-form-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Deep Search
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}