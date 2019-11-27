import { UserRole } from './_data';

export interface ITenant {
  id: string;
  profileImageUrl: string;
}

export interface ITenantState {
  tenant: ITenant;
  users: { [ key: string]: IUser };
}

export interface ITenantStore {
  id: string;
  profileImageUrl: string;
  tenant: ITenant;
  clear(): void;
  setTenant(tenant: ITenant): void;
  signIn(token?: string): Promise<void>;
  signOut(returnPath?: string): Promise<void>;
}

export interface IUser {
  id: string;
  profileImageUrl: string;
  role: UserRole;
}
