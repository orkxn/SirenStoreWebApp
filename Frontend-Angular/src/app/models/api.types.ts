// TypeScript types corresponding to .NET Core Backend DTOs (camelCase)

export enum UserTypes {
  Customer = 0,
  Seller = 1,
  Admin = 2,
  SuperAdmin = 3
}

export enum OrderStatus {
  Received = 1,
  Preparing = 2,
  Shipped = 3,
  Delivered = 4,
  Cancelled = 5
}

export enum SellerStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3
}

export interface TokenDto {
  accessToken: string;
  expiration: string; // ISO DateTime string
  refreshToken: string;
}

export interface UserProfileDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  userType: UserTypes;
  isEmailConfirmed: boolean;
}

export interface BasketItemDto {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  productImageUrl: string | null;
}

export interface BasketDto {
  id: number;
  items: BasketItemDto[];
  grandTotal: number;
}

export interface CategoryDto {
  id: number;
  name: string;
}

export interface ProductDto {
  id: number;
  name: string;
  description: string;
  brand: string;
  price: number;
  stock: number;
  sellerId: number;
  isActive: boolean;
}

export interface ProductListDto {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  categoryName: string;
  sellerId: number;
  storeName: string;
  mainImageUrl: string | null;
  imageUrls: string[];
}

export interface OrderItemDto {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  status: string;
}

export interface OrderDto {
  id: number;
  createdDate: string;
  totalPrice: number;
  addressTitle: string;
  shippingAddress: string;
  status: string;
  orderItems: OrderItemDto[];
}

export interface SellerDto {
  id: number;
  storeName: string;
  contactEmail: string;
  contactPhone: string;
  isApproved: boolean;
  isActive: boolean;
}

export interface SellerPublicProfileDto {
  id: number;
  storeName: string;
  storeLogoUrl: string;
  ownerFullName: string;
  contactLine: string;
  products: ProductListDto[];
}

export interface SellerManagementDto {
  id: number;
  userId: number;
  userEmail: string;
  storeName: string;
  taxNumber: string | null;
  taxOffice: string | null;
  contactEmail: string;
  contactPhone: string;
  supportLine: string;
  status: SellerStatus;
  isDeleted: boolean;
}

export interface UserManagementDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: UserTypes;
  isDeleted: boolean;
  isEmailConfirmed: boolean;
}

export interface CommentDto {
  id: number;
  text: string;
  rating: number;
  creationDate: string;
  userId: number;
  userFullName: string;
  productId: number;
}

export interface CommentCreateDto {
  text: string;
  rating: number;
  productId: number;
}

export interface CommentUpdateDto {
  text: string;
  rating: number;
}
