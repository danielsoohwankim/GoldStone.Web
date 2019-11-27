import { AxiosResponse } from 'axios';
import { Page, Theme } from './_data';

export interface ILayoutState {
  menu: IMenu;
  page: Page;
  showLoader: boolean;
  showMenu: boolean;
  showSetting: boolean;
  showSignInButton: boolean;
  snackBarView: ISnackBarView;
  theme: Theme;
}

export interface ILayoutStore {
  menu: IMenu;
  page: Page;
  showLoader: boolean;
  showMenu: boolean;
  showSetting: boolean;
  showSignInButton: boolean;
  snackBarView: ISnackBarView;
  theme: Theme;
  clear(showSignInButton: boolean): void;
  dismissSnackBar(): void;
  setMenu(menuName: string): void;
  setTheme(theme: Theme): Theme;
  setPage(page: Page): void;
  setSnackBar(payload: ISnackBarView): ISnackBarView;
  toggleLoader(showLoader: boolean): boolean;
  toggleMenu(showMenu: boolean): boolean;
  toggleSetting(show: boolean): void;
  toggleSignInButton(show: boolean): void;
}

export type LoaderCallback = () => any;

export interface ILoaderAction {
  sendAsync(callback: LoaderCallback): Promise<AxiosResponse>;
}

export interface IMenu {
  icon: string;
  name: string;
  path: string;
  title: string;
}

export interface ISnackBarView {
  duration: number | undefined;
  message: string;
  show: boolean;
}
