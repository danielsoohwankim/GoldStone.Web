import { Theme } from './_data';

export interface ILayoutStore {
  menu: IMenu;
  showLoader: boolean;
  showMenu: boolean;
  showSetting: boolean;
  theme: Theme;
  dismissSnackBar(): void;
  setSnackBar(payload: ISnackBarView): ISnackBarView;
  setMenu(menuName: string): string;
  setTheme(theme: Theme): Theme;
  toggleLoader(showLoader: boolean): boolean;
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

export interface ISnackBarView {
  duration: number | undefined;
  message: string;
  show: boolean;
}
