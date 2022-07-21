export interface PageElements<T> {
    elements: T[];
    maxElements: number;
    currentPage: number;
    maxPages: number;
}