interface ApiErrorShape {
  response?: {
    data?: {
      error?: {
        message?: string;
      };
    };
  };
}

export function getApiError(e: unknown, fallback = 'Error'): string {
  const err = e as ApiErrorShape;
  return err?.response?.data?.error?.message ?? fallback;
}
