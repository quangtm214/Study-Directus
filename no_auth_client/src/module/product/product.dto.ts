export interface CreateProductDto {
    name: string;
    price: number;
    description?: string; // có thể null
    image?: string | null; // file id (UUID)
    category?: string | null; // UUID từ bảng category
    status?: string; // archived / draft...
    sort?: number;
}