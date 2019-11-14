import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { menus, Theme } from './_data';
import { ILayoutStore, IMenu, ISnackBarView } from './_interfaces';
import store from '@/shared/_store';

@Module({
  namespaced: true,
  name: 'LayoutStore',
  store,
  dynamic: true,
})
class LayoutStore extends VuexModule implements ILayoutStore {
  private Menu: IMenu = menus.dashboard;
  private ShowLoader: boolean = false;
  private ShowMenu: boolean = false;
  private ShowSetting: boolean = false;
  private SnackBarView: ISnackBarView = {
    duration: undefined,
    message: '',
    show: false,
  };
  private Theme: Theme = Theme.Dark;

  get menu(): IMenu {
    return this.Menu;
  }

  get showLoader(): boolean {
    return this.ShowLoader;
  }

  get showMenu(): boolean {
    return this.ShowMenu;
  }

  get showSetting(): boolean {
    return this.ShowSetting;
  }

  get snackBarView(): ISnackBarView {
    return this.SnackBarView;
  }

  get theme(): Theme {
    return this.Theme;
  }

  @Action({commit: 'DismissSnackBar'})
  public dismissSnackBar(): void {
    //
  }

  @Action({commit: 'SetMenu'})
  public setMenu(menuName: string): string {
    return menuName;
  }

  @Action({commit: 'SetSnackBar'})
  public setSnackBar(payload: ISnackBarView): ISnackBarView {
    return payload;
  }

  @Action({commit: 'SetTheme'})
  public setTheme(theme: Theme): Theme {
    return theme;
  }

  @Action({commit: 'ToggleLoader'})
  public toggleLoader(showLoader: boolean): boolean {
    return showLoader;
  }

  @Action({commit: 'ToggleMenu'})
  public toggleMenu(showMenu: boolean): boolean {
    return showMenu;
  }

  @Action({commit: 'ToggleSetting'})
  public toggleSetting(showSetting: boolean): boolean {
    return showSetting;
  }

  @Mutation
  private DismissSnackBar(): void {
    this.SnackBarView = {
      duration: undefined,
      message: '',
      show: false,
    };
  }

  @Mutation
  private SetMenu(menuName: string): void {
    this.Menu = menus.getMenu(menuName);
  }

  @Mutation
  private SetSnackBar(payload: ISnackBarView): void {
    this.SnackBarView = payload;
  }

  @Mutation
  private SetTheme(theme: Theme): void {
    this.Theme = theme;
  }

  @Mutation
  private ToggleLoader(showLoader: boolean): void {
    this.ShowLoader = showLoader;
  }

  @Mutation
  private ToggleMenu(showMenu: boolean): void {
    this.ShowMenu = showMenu;
  }

  @Mutation
  private ToggleSetting(showSetting: boolean): void {
    this.ShowSetting = showSetting;
  }
}

export default getModule(LayoutStore);
