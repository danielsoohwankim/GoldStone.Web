export interface IUser {
  id: string;
}

export interface IUserStore {
  user: IUser;
  getUserAsync(): Promise<IUser>;
  setUser(user: IUser): IUser;
}
