import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { menus, Theme } from './_data';
import { ILayoutStore, IMenu } from './_interfaces';
import store from '@/shared/_store';

@Module({
  namespaced: true,
  name: 'LayoutStore',
  store,
  dynamic: true,
})
class LayoutStore extends VuexModule implements ILayoutStore {
  private Menu: IMenu = menus.dashboard;
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
  public setMenu(menuName: string): string {
    return menuName;
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
  private SetMenu(menuName: string): void {
    this.Menu = menus.getMenu(menuName);
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

export default getModule(LayoutStore);
