export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  institution?: string;
  researchDomain?: string;
  createdAt?: string;
}
