import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import HttpStatus from 'http-status-codes';
import { ITenantStore } from './_interfaces';
import goldStoneClient from '@/clients/goldStoneClient';
import { ISignInResponseContractV1 } from '@/clients/IGoldStoneClient';
import { Menus, Page } from '@/layout/_data';
import layoutStore from '@/layout/_store';
import loaderAction from '@/layout/loaderAction';
import store from '@/shared/_store';
import { storageTools } from '@/shared/_tools';
import router from '@/router';

@Module({
  namespaced: true,
  name: 'TenantStore',
  store,
  dynamic: true,
})
class TenantStore extends VuexModule implements ITenantStore {
  get hasToken(): boolean {
    return storageTools.hasToken();
  }

  get id(): string {
    return storageTools.getTenantId();
  }

  get token(): string {
    return storageTools.getToken();
  }

  @Action
  public async signIn(token?: string): Promise<void> {
    layoutStore.toggleSignInButton(false);

    // 404
    if (Menus.IsValidPath(router.currentRoute.path) === false) {
      if (layoutStore.page !== Page.NotFound) {
        layoutStore.setPage(Page.NotFound);
      }

      return;
    }

    // send the user to sign in page
    if (!token && storageTools.hasToken() === false) {
      // tslint:disable-next-line
      console.log(`user doesn't have token`);
      if (layoutStore.page !== Page.Home) {
        layoutStore.setPage(Page.Home);
      }
      layoutStore.toggleSignInButton(true);

      return;
    }

    token = (token) ? token : storageTools.getToken();

    const response = await loaderAction.sendAsync(
      () => goldStoneClient.signIn(token!));

    if (!response || response.status !== HttpStatus.OK) {
      // tslint:disable-next-line
      console.log(response);

      if (layoutStore.page !== Page.Home) {
        layoutStore.setPage(Page.Home);
      }
      layoutStore.toggleSignInButton(true);

      return;
    }

    // tslint:disable-next-line
    console.log('successfully signed in');

    const { accessToken, profileImageUrl, tenantId }
      = (response.data as ISignInResponseContractV1);

    storageTools.setToken(accessToken);
    storageTools.setTenantId(tenantId);

    if (layoutStore.page !== Page.Default) {
      layoutStore.setPage(Page.Default);
    }
    if (Menus.IsValidPath(router.currentRoute.path) === true
      && router.currentRoute.name !== layoutStore.menu.name) {
      layoutStore.setMenu(router.currentRoute.name!);
    }

    return;
  }

  /**
   * returnPath:
   *  if provided, returns the user to the provided path
   *  upon successful re-login
   */
  @Action
  public async signOut(returnPath?: string): Promise<void> {
    // @ts-ignore
    const auth2 = gapi.auth2.getAuthInstance();

    try {
      await auth2.signOut();
    } catch (e) {
      // tslint:disable-next-line
      console.log('User failed to sign out', e);

      return;
    }

    storageTools.removeToken();
    storageTools.removeTenantId();
    // tslint:disable-next-line
    console.log('Sign out success!');

    if (layoutStore.showSetting === true) {
      layoutStore.toggleSetting(false);
    }
    if (layoutStore.page !== Page.Home) {
      layoutStore.setPage(Page.Home);
    }
    layoutStore.toggleSignInButton(true);

    if (returnPath) {
      if (router.currentRoute.path !== returnPath) {
        router.push(returnPath);
      }
    } else if (router.currentRoute.path !== '/') {
      router.push('/');
    }

    return;
  }
}

export default getModule(TenantStore);
