export interface IDevice {
  isMobile(): boolean;
}

export interface IStorageTools {
  hasToken(): boolean;
  hasTenantId(): boolean;
  getToken(): string;
  getTenantId(): string;
  removeToken(): void;
  removeTenantId(): void;
  setToken(token: string): void;
  setTenantId(id: string): void;
}
