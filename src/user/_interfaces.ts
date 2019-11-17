export interface IUserStore {
  hasToken: boolean;
  id: string;
  token: string;
  signIn(token?: string): Promise<boolean>;
  signOut(returnPath?: string): Promise<boolean>;
}
