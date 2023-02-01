export interface Address {
    id: string,
    country?: string,
    state?: string,
    city?: string,
    address?: string,
    address2?: string | null,
    zip?: string,
    phone?: string,
    fax?:string | null,
    createdAt:string,
}