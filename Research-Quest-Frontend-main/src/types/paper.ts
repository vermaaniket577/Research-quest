export interface Paper {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  publicationYear: number;
  doi: string;
  keywords: string[];
  abstract: string;
  url?: string;
  citations?: number;
  relevanceScore?: number;
  publisher?: string;
  volume?: string;
  issue?: string;
  pages?: string;
}

export interface SearchRequest {
  query: string;
  page?: number;
  limit?: number;
  subject?: string;
  specialization?: string;
  keywords?: string;
  yearFrom?: number;
  yearTo?: number;
}

export interface DeepSearchRequest {
  subject: string;
  specialization: string;
  keywords: string | string[];
  title?: string;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  success: boolean;
  data: {
    papers: Paper[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    similarPapers?: Paper[];
  };
  message?: string;
}

export interface PaperSearchState {
  papers: Paper[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  searchMode: 'simple' | 'deep';
  query: string;
  deepSearchParams: DeepSearchRequest;
  similarPapers: Paper[];
  selectedPaper: Paper | null;
}