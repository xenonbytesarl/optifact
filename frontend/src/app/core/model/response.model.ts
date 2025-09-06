export interface CommonApiResponse {
  success: boolean;
  code: number;
  status: string;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorApiResponse extends CommonApiResponse{
  correlationId: string;
  reason: string;
  path: string;
  errors?: ValidationError[];
}

export interface SuccessApiResponse<T> {
  success: boolean;
  message: string;
  code?: number;
  status: string;
  timestamp?: string;
  data: {content: T};
}

export interface Page<T> {
  elements: T[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
}

