export interface IDevice {
  isMobile(): boolean;
}

export interface IStorageTools {
  hasPath(): boolean;
  hasToken(): boolean;
  getPath(): string;
  getToken(): string;
  removePath(): void;
  removeToken(): void;
  setToken(token: string): void;
}
