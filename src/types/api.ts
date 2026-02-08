export type ApiErrorResponse = {
  success: false;
  statusCode: string;
  message: string;
};

export type ApiSuccessResponse<T = null> = {
  success: true;
  message: string;
  data?: T;
};

export type ApiResponse<T = null> = ApiSuccessResponse<T> | ApiErrorResponse;
