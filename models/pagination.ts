export type Page<T> = {
    content: T[];
    totalElements: number
}

export type Pagination = {
    page: number;
    limit: number
}

export function PaginationOf<T>(limit: number = 25, page: number = 1): Pagination {
    return {
        page: page,
        limit: limit
    } as Pagination;
}

export function PageOf<T>(items: T[], totalElements: number): Page<T> {
    return {
        content: items,
        totalElements: totalElements
    } as Page<T>
}
