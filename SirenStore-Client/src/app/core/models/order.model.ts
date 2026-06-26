export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  status: string;
}

export interface Order {
  id: number;
  createdDate: Date;
  totalPrice: number;
  addressTitle: string;
  shippingAddress: string;
  status: string;
  orderItems: OrderItem[];
}

export interface CreateOrderRequest {
  addressTitle: string;
  shippingAddress: string;
}
