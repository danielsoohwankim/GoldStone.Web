import { Theme } from './_data';

export interface ILayoutStore {
  menu: IMenu;
  showMenu: boolean;
  showSetting: boolean;
  theme: Theme;
  setMenu(menuName: string): string;
  setTheme(theme: Theme): Theme;
  toggleMenu(showMenu: boolean): boolean;
  toggleSetting(showSetting: boolean): boolean;
}

export interface IMenu {
  icon: string;
  name: string;
  route: string;
  title: string;
}

export interface IMenus {
  dashboard: IMenu;
  assets: IMenu;
  accountant: IMenu;
  getMenu(menuName: string): IMenu;
}
