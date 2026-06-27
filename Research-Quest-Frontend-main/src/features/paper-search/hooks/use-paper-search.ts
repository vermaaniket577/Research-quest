'use client';

import { useState, useCallback, useRef } from 'react';
import { Paper, DeepSearchRequest, SearchResponse } from '@/types/paper';
import { simpleSearch, deepSearch, getSimilarPapers } from '@/features/paper-search/services';

interface DeepSearchFormState {
  subject: string;
  specialization: string;
  keywords: string;
}

interface UsePaperSearchReturn {
  papers: Paper[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  searchMode: 'simple' | 'deep';
  query: string;
  deepSearchParams: DeepSearchFormState;
  similarPapers: Paper[];
  selectedPaper: Paper | null;
  setSearchMode: (mode: 'simple' | 'deep') => void;
  setQuery: (query: string) => void;
  setDeepSearchParams: (params: DeepSearchFormState) => void;
  handleSimpleSearch: (pageNum?: number) => Promise<void>;
  handleDeepSearch: (pageNum?: number) => Promise<void>;
  handleViewPaper: (paper: Paper) => void;
  handleCloseDetail: () => void;
  handlePageChange: (newPage: number) => void;
}

export function usePaperSearch(): UsePaperSearchReturn {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<'simple' | 'deep'>('simple');
  const [query, setQuery] = useState('');
  const [deepSearchParams, setDeepSearchParams] = useState<DeepSearchFormState>({
    subject: '',
    specialization: '',
    keywords: '',
  });
  const [similarPapers, setSimilarPapers] = useState<Paper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  
  const searchInProgress = useRef(false);

  const handleSimpleSearch = useCallback(async (pageNum?: number) => {
    if (!query.trim() || searchInProgress.current) return;
    
    searchInProgress.current = true;
    setIsLoading(true);
    setError(null);
    setSelectedPaper(null);
    setSimilarPapers([]);

    const currentPage = pageNum || 1;
    setPage(currentPage);

    try {
      const response: SearchResponse = await simpleSearch({
        query: query.trim(),
        page: currentPage,
        limit,
      });

      if (response.success) {
        setPapers(response.data.papers);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages || Math.ceil(response.data.total / limit));
        if (response.data.similarPapers) {
          setSimilarPapers(response.data.similarPapers);
        }
      } else {
        throw new Error(response.message || 'Search returned no results');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setPapers([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
      searchInProgress.current = false;
    }
  }, [query, limit]);

  const handleDeepSearch = useCallback(async (pageNum?: number) => {
    if (!deepSearchParams.keywords.trim() || searchInProgress.current) return;
    
    searchInProgress.current = true;
    setIsLoading(true);
    setError(null);
    setSelectedPaper(null);
    setSimilarPapers([]);

    const currentPage = pageNum || 1;
    setPage(currentPage);

    try {
      const keywordsArray = typeof deepSearchParams.keywords === 'string'
        ? deepSearchParams.keywords.split(',').map((k) => k.trim()).filter(Boolean)
        : deepSearchParams.keywords;

      const response: SearchResponse = await deepSearch({
        ...deepSearchParams,
        keywords: keywordsArray,
        page: currentPage,
        limit,
      });

      if (response.success) {
        setPapers(response.data.papers);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages || Math.ceil(response.data.total / limit));
        if (response.data.similarPapers) {
          setSimilarPapers(response.data.similarPapers);
        }
      } else {
        throw new Error(response.message || 'Search returned no results');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setPapers([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
      searchInProgress.current = false;
    }
  }, [deepSearchParams, limit]);

  const handleViewPaper = useCallback(async (paper: Paper) => {
    setSelectedPaper(paper);
    setSimilarPapers([]);
    
    // Fetch similar papers for the selected paper
    try {
      const response = await getSimilarPapers(paper.id);
      if (response.success) {
        setSimilarPapers(response.data);
      }
    } catch {
      // Silently fail - similar papers are optional
    }
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedPaper(null);
    setSimilarPapers([]);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    if (searchMode === 'simple') {
      handleSimpleSearch(newPage);
    } else {
      handleDeepSearch(newPage);
    }
  }, [searchMode, handleSimpleSearch, handleDeepSearch]);

  return {
    papers,
    total,
    page,
    limit,
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
  };
}