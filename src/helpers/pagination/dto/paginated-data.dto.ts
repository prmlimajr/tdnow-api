export class PaginatedDataDto<T> {
  total: number;
  currentPage: number;
  lastPage: number;
  pageSize: number;
  data: T[];
}
