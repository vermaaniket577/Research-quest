import { api } from '@/lib/axios';
import { SearchRequest, DeepSearchRequest, SearchResponse, Paper } from '@/types/paper';

export async function simpleSearch(params: SearchRequest): Promise<SearchResponse> {
  const queryParams = new URLSearchParams();
  
  if (params.query) queryParams.append('subject', params.query); // Backend uses payload.subject for search query mapping
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.yearFrom) queryParams.append('yearFrom', params.yearFrom.toString());
  if (params.yearTo) queryParams.append('yearTo', params.yearTo.toString());
  if (params.subject) queryParams.append('subject', params.subject);
  if (params.specialization) queryParams.append('specialization', params.specialization);
  if (params.keywords) queryParams.append('keywords', params.keywords);

  // Send request using global Axios client
  const res = await api.get<SearchResponse>(`/papers/simple-search?${queryParams.toString()}`);
  return res.data;
}

export async function deepSearch(params: DeepSearchRequest): Promise<SearchResponse> {
  const res = await api.post<SearchResponse>('/papers/deep-search', params);
  return res.data;
}

export async function getSimilarPapers(paperId: string): Promise<{ success: boolean; data: Paper[] }> {
  const res = await api.get<{ success: boolean; data: Paper[] }>(`/papers/${paperId}/similar`);
  return res.data;
}

export async function getPaperById(paperId: string): Promise<{ success: boolean; data: Paper }> {
  const res = await api.get<{ success: boolean; data: Paper }>(`/papers/${paperId}`);
  return res.data;
}