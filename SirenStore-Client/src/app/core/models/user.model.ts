export enum UserTypes {
  Customer = 0,
  Seller = 1,
  Admin = 2
}

// Her Modelde Ortak Olan Veritabanı Alanları
export interface BaseModel {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted: boolean;
}

// Ana Kullanıcı Şablonu
export interface User extends BaseModel {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string; 
  userType: UserTypes;
  isActive: boolean;
  isEmailConfirmed: boolean;
  refreshToken?: string;
  refreshTokenExpiryTime?: Date;
  addresses?: any[];      
  seller?: any;          
  loginHistories?: any[];
}

// Backend TokenDto'ya birebir uyumlu Login yanıtı
export interface TokenResponse {
  accessToken: string;
  expiration: string;
  refreshToken: string;
}

// Login isteği
export interface LoginRequest {
  email: string;
  password: string; 
}

// Register isteği
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

// Profil güncelleme isteği
export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

// Backend'den dönen Profil detayları
export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  userType: UserTypes;
  isEmailConfirmed: boolean;
}

// Şifre değiştirme isteği
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// JWT token'dan çıkarılan kullanıcı bilgisi
export interface DecodedUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: UserTypes;
}