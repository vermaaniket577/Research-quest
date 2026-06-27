export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiError {
  error: string;
  errors?: string[];
  message?: string;
}
