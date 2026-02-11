export type ApiErrorResponse = {
  success: false;
  statusCode: string;
  message: string;
};

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
