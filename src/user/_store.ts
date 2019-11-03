import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { IUser, IUserStore } from './_interfaces';
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

  @Action({commit: 'SetUser'})
  public async setUser(user: IUser): Promise<IUser> {
    return user;
  }

  @Mutation
  private SetUser(user: IUser): void {
    this.User = user;
  }
}

export default getModule(UserStore);
