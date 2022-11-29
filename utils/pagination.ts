export type Pagination = {
    page: number;
    limit: number;
}
export type Filter = {
    property: string;
    value: string;
    operation: string;
}
export type Sort = {
    by: string;
    direction: string;
    caseSensitive: boolean;
}
export type PaginatedRequest = {
    where: Filter[],
    pagination: Pagination;
    sort: Sort[];
}