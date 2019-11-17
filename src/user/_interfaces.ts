export interface IUserStore {
  hasToken: boolean;
  id: string;
  token: string;
  signIn(token?: string): Promise<void>;
  signOut(returnPath?: string): Promise<void>;
}
