export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  
  categoryName?: string;
  storeName?: string;
  
  // Backend'den dönen asıl resim alanı
  mainImageUrl?: string;
  
  categoryId?: number;
  sellerId?: number;
  isActive?: boolean;
}
