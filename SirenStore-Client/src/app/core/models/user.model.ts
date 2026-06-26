export enum UserTypes {
  Customer = 0,
  Seller = 1,
  Admin = 2
}

// 2. Her Modelde Ortak Olan Veritabanı Alanları
export interface BaseModel {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted: boolean;
}

// 3. Ana Kullanıcı Şablonu
export interface User extends BaseModel {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string; 
  userType: UserTypes;
  isActive: boolean;
  isEmailConfirmed: boolean;

  // JWT Oturum Yenileme Alanları
  refreshToken?: string;
  refreshTokenExpiryTime?: Date;

  // İlişkili Diğer Modeller
  addresses?: any[];      
  seller?: any;          
  loginHistories?: any[];
}

// 4. (Login Request)
export interface LoginRequest {
  email: string;
  passwordHash: string; 
}

// 5. (Login Response)
export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}