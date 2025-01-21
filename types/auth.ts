export type UserRole = 'user' | 'admin' | 'super_admin';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  name?: string;
  phone?: string;
  createdAt: Date;
  lastLogin: Date;
} 