import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { IUser, IUserStore } from './_interfaces';
import goldStoneClient from '@/clients/goldStoneClient';
import store from '@/shared/_store';

@Module({
  namespaced: true,
  name: 'UserStore',
  store,
  dynamic: true,
})
class UserStore extends VuexModule implements IUserStore {
  private User: IUser = {
    id: '',
  };

  get user(): IUser {
    return this.User;
  }

  @Action
  public async getUserAsync(): Promise<IUser> {
    const userId: string = await goldStoneClient.getAdminUserId() as string;
    const user: IUser = {
      id: userId,
    };

    return user;
  }

  @Action({commit: 'SetUser'})
  public setUser(user: IUser): IUser {
    return user;
  }

  @Mutation
  private SetUser(user: IUser): void {
    this.User = user;
  }
}

export default getModule(UserStore);
