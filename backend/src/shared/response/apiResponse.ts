export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export const successResponse = <T>(
  message: string,
  data?: T,
  meta?: ApiResponse['meta']
): ApiResponse<T> => ({
  success: true,
  message,
  data,
  meta,
});

export const errorResponse = (
  message: string,
  errors?: string[]
): ApiResponse => ({
  success: false,
  message,
  errors,
});