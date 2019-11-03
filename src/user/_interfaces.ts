export interface IUser {
  id: string;
}

export interface IUserStore {
  user: IUser;
  setUser(user: IUser): Promise<IUser>;
}
