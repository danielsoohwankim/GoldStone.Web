import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { Menus, Page, Theme } from './_data';
import { ILayoutState, ILayoutStore, IMenu, ISnackBarView } from './_interfaces';
import store from '@/shared/_store';
import router from '@/router';

@Module({
  namespaced: true,
  name: 'LayoutStore',
  store,
  dynamic: true,
})
class LayoutStore extends VuexModule implements ILayoutStore {
  // initial state
  private initialState: ILayoutState = {
    menu: Menus.Dashboard,
    page: Page.Home,
    showLoader: false,
    showMenu: false,
    showSetting: false,
    showSignInButton: false,
    snackBarView: {
      duration: undefined,
      message: '',
      show: false,
    },
    theme: Theme.Dark,
  };
  // lowercase 'state' is reserved in Vuex
  private State: ILayoutState = {
    menu: this.initialState.menu,
    page: this.initialState.page,
    showLoader: this.initialState.showLoader,
    showMenu: this.initialState.showMenu,
    showSetting: this.initialState.showSetting,
    showSignInButton: this.initialState.showSignInButton,
    snackBarView: this.initialState.snackBarView,
    theme: this.initialState.theme,
  };

  get menu(): IMenu {
    return this.State.menu;
  }

  get page(): Page {
    return this.State.page;
  }

  get showLoader(): boolean {
    return this.State.showLoader;
  }

  get showMenu(): boolean {
    return this.State.showMenu;
  }

  get showSetting(): boolean {
    return this.State.showSetting;
  }

  get showSignInButton(): boolean {
    return this.State.showSignInButton;
  }

  get snackBarView(): ISnackBarView {
    return this.State.snackBarView;
  }

  get theme(): Theme {
    return this.State.theme;
  }

  @Action
  public clear(showSignInButton: boolean): void {
    this.context.commit('Clear', showSignInButton);
  }

  @Action({commit: 'DismissSnackBar'})
  public dismissSnackBar(): void {
    //
  }

  @Action({commit: 'SetMenu'})
  public setMenu(menuName: string): string {
    return menuName;
  }

  @Action
  public setPage(page: Page): void {
    if (Menus.IsValidPath(router.currentRoute.path) === true &&
        router.currentRoute.name &&
        this.context.getters.menu.name !== router.currentRoute.name) {
      this.context.commit('SetMenu', router.currentRoute.name);
    }
    if (this.context.getters.page === page) {
      return;
    }
    this.context.commit('SetPage', page);
  }

  @Action({commit: 'SetTheme'})
  public setTheme(theme: Theme): Theme {
    return theme;
  }

  @Action({commit: 'SetSnackBar'})
  public setSnackBar(payload: ISnackBarView): ISnackBarView {
    return payload;
  }

  @Action({commit: 'ToggleLoader'})
  public toggleLoader(showLoader: boolean): boolean {
    return showLoader;
  }

  @Action({commit: 'ToggleMenu'})
  public toggleMenu(showMenu: boolean): boolean {
    return showMenu;
  }

  @Action
  public toggleSetting(show: boolean): void {
    if (this.context.getters.showSetting === show) {
      return;
    }

    this.context.commit('ToggleSetting', show);
  }

  @Action
  public toggleSignInButton(show: boolean): void {
    if (this.context.getters.page !== Page.Home ||
        this.context.getters.showSignInButton === show) {
      return;
    }

    this.context.commit('ToggleSignInButton', show);
  }

  @Mutation
  private Clear(showSignInButton: boolean): void {
    const state: ILayoutState = this.initialState;
    state.showSignInButton = showSignInButton;

    this.State = state;
  }

  @Mutation
  private DismissSnackBar(): void {
    this.State.snackBarView = {
      duration: undefined,
      message: '',
      show: false,
    };
  }

  @Mutation
  private SetMenu(menuName: string): void {
    this.State.menu = Menus.GetMenu(menuName);
  }

  @Mutation
  private SetPage(page: Page): void {
    this.State.page = page;
  }

  @Mutation
  private SetSnackBar(payload: ISnackBarView): void {
    this.State.snackBarView = payload;
  }

  @Mutation
  private SetTheme(theme: Theme): void {
    this.State.theme = theme;
  }

  @Mutation
  private ToggleLoader(showLoader: boolean): void {
    this.State.showLoader = showLoader;
  }

  @Mutation
  private ToggleMenu(showMenu: boolean): void {
    this.State.showMenu = showMenu;
  }

  @Mutation
  private ToggleSetting(show: boolean): void {
    this.State.showSetting = show;
  }

  @Mutation
  private ToggleSignInButton(show: boolean): void {
    this.State.showSignInButton = show;
  }
}

export default getModule(LayoutStore);
