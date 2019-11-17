import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import HttpStatus from 'http-status-codes';
import { IUserStore } from './_interfaces';
import goldStoneClient from '@/clients/goldStoneClient';
import { Menus, Page } from '@/layout/_data';
import layoutStore from '@/layout/_store';
import loaderAction from '@/layout/loaderAction';
import store from '@/shared/_store';
import { storageTools } from '@/shared/_tools';
import router from '@/router';

@Module({
  namespaced: true,
  name: 'UserStore',
  store,
  dynamic: true,
})
class UserStore extends VuexModule implements IUserStore {
  get hasToken(): boolean {
    return storageTools.hasToken();
  }

  get id(): string {
    return storageTools.getUserId();
  }

  get token(): string {
    return storageTools.getToken();
  }

  @Action
  public async signIn(token?: string): Promise<boolean> {
    if (token) {
      storageTools.setToken(token);
    }

    // 404
    if (Menus.IsValidPath(router.currentRoute.path) === false) {
      if (layoutStore.page !== Page.NotFound) {
        layoutStore.setPage(Page.NotFound);
      }

      return false;
    }

    // send the user to sign in page
    if (storageTools.hasToken() === false) {
      // tslint:disable-next-line
      console.log(`user doesn't have token`);
      if (layoutStore.page !== Page.Home) {
        layoutStore.setPage(Page.Home);
      }

      return false;
    }

    const response = await loaderAction.sendAsync(
      () => goldStoneClient.signIn());

    if (!response || response.status !== HttpStatus.OK) {
      // tslint:disable-next-line
      console.log(response);

      if (layoutStore.page !== Page.Home) {
        layoutStore.setPage(Page.Home);
      }

      return false;
    }

    // tslint:disable-next-line
    console.log('successfully signed in');

    const userId: string = response.data;

    storageTools.setUserId(userId);

    if (layoutStore.page !== Page.Default) {
      layoutStore.setPage(Page.Default);
    }
    if (Menus.IsValidPath(router.currentRoute.path) === true
      && router.currentRoute.name !== layoutStore.menu.name) {
      layoutStore.setMenu(router.currentRoute.name!);
    }

    return true;
  }

  /**
   * returnPath:
   *  if provided, returns the user to the provided path
   *  upon successful re-login
   */
  @Action
  public async signOut(returnPath?: string): Promise<boolean> {
    // @ts-ignore
    const auth2 = gapi.auth2.getAuthInstance();

    try {
      await auth2.signOut();
    } catch (e) {
      // tslint:disable-next-line
      console.log('User failed to sign out', e);

      return false;
    }

    storageTools.removeToken();
    storageTools.removeUserId();
    // tslint:disable-next-line
    console.log('Sign out success!');

    layoutStore.toggleSetting(false);
    layoutStore.toggleSignInButton(true);

    if (layoutStore.page !== Page.Home) {
      layoutStore.setPage(Page.Home);
    }

    if (returnPath) {
      if (router.currentRoute.path !== returnPath) {
        router.push(returnPath);
      }
    } else if (router.currentRoute.path !== '/') {
      router.push('/');
    }

    return true;
  }
}

export default getModule(UserStore);
