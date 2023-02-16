export interface Location {
    id: string,
    name?: string,
    country?: string,
    region?: string,
    locality?: string,
    zip?: string,
    address?: string,
    address2?: string | null,
}