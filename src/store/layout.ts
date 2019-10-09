import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { Theme } from '@/models/common.ts';
import { IMenu, Menu } from '@/models/menu.ts';
import store from '@/store';

@Module({
  namespaced: true,
  name: 'Setting',
  store,
  dynamic: true,
})
class LayoutModule extends VuexModule {
  private Menu: IMenu = Menu.dashboard;
  private ShowMenu: boolean = false;
  private ShowSetting: boolean = false;
  private Theme: Theme = Theme.Dark;

  get menu(): IMenu {
    return this.Menu;
  }

  get showMenu(): boolean {
    return this.ShowMenu;
  }

  get showSetting(): boolean {
    return this.ShowSetting;
  }

  get theme(): Theme {
    return this.Theme;
  }

  @Action({commit: 'SetMenu'})
  public setMenu(menu: IMenu): IMenu {
    return menu;
  }

  @Action({commit: 'SetTheme'})
  public setTheme(theme: Theme): Theme {
    return theme;
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
  private SetMenu(menu: IMenu): void {
    this.Menu = menu;
  }

  @Mutation
  private SetTheme(theme: Theme): void {
    this.Theme = theme;
  }

  @Mutation
  private ToggleSetting(showSetting: boolean): void {
    this.ShowSetting = showSetting;
  }

  @Mutation
  private ToggleMenu(showMenu: boolean): void {
    this.ShowMenu = showMenu;
  }
}

export default getModule(LayoutModule);
