export interface PaginatedInterface<T> {
  data: T[];
  success: boolean;
  message: string;
  status: number;
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
  links: {
    first: string;
    last: string;
    current: string;
    next: string;
    previous: string;
  };
}

export interface PaginatedDetailsInterface<T> {
  data?: T | null;
  success?: boolean;
  message?: string;
  status?: number;
}
