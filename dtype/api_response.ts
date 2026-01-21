export type ApiResponse<T> = {
  message: string;
  success: boolean;
  data: {
    data: T;
    total: number;
  };
};
