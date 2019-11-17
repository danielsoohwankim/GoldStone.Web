export interface IDevice {
  isMobile(): boolean;
}

export interface IStorageTools {
  hasToken(): boolean;
  hasUserId(): boolean;
  getToken(): string;
  getUserId(): string;
  removeToken(): void;
  removeUserId(): void;
  setToken(token: string): void;
  setUserId(id: string): void;
}
