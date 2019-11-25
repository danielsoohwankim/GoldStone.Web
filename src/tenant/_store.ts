import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import HttpStatus from 'http-status-codes';
import { ITenant, ITenantState, ITenantStore } from './_interfaces';
import assetsStore from '@/assets/_store';
import assetsTools from '@/assets/_tools';
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
  private initialState: ITenantState = {
    tenant: {
      id: '',
      profileImageUrl: '',
    },
  };

  private State: ITenantState = {
    tenant: this.initialState.tenant,
  };

  get id(): string {
    return this.State.tenant.id;
  }

  get profileImageUrl(): string {
    return this.State.tenant.profileImageUrl;
  }

  get tenant(): ITenant {
    return this.State.tenant;
  }

  @Action
  public clear(): void {
    this.context.commit('Clear');
  }

  @Action
  public setTenant(tenant: ITenant): void {
    this.context.commit('SetTenant', tenant);
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
      layoutStore.setPage(Page.Home);
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
    const tenant: ITenant = {
      id: tenantId,
      profileImageUrl,
    };

    storageTools.setToken(accessToken);
    this.context.commit('SetTenant', tenant);

    layoutStore.setPage(Page.Default);
    if (Menus.IsValidPath(router.currentRoute.path) === true &&
        router.currentRoute.name !== layoutStore.menu.name) {
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
    assetsStore.clear();
    layoutStore.clear(true);
    this.context.commit('Clear');
    // tslint:disable-next-line
    console.log('Sign out success!');

    if (returnPath) {
      if (router.currentRoute.path !== returnPath) {
        router.push(returnPath);
      }
    } else if (router.currentRoute.path !== '/') {
      router.push('/');
    }

    return;
  }

  @Mutation
  private Clear(): void {
    this.State = this.initialState;
  }

  @Mutation
  private SetTenant(tenant: ITenant): void {
    this.State.tenant = tenant;
  }
}

export default getModule(TenantStore);
