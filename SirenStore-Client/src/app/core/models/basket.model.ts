export interface BasketItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  productImageUrl?: string;
}

export interface Basket {
  id: number;
  items: BasketItem[];
  grandTotal: number;
}

export interface AddToBasketRequest {
  productId: number;
  quantity: number;
}
