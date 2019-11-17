import { AxiosResponse } from 'axios';
import { Page, Theme } from './_data';

export interface ILayoutStore {
  menu: IMenu;
  page: Page;
  showLoader: boolean;
  showMenu: boolean;
  showSetting: boolean;
  showSignInButton: boolean;
  snackBarView: ISnackBarView;
  theme: Theme;
  dismissSnackBar(): void;
  setMenu(menuName: string): string;
  setTheme(theme: Theme): Theme;
  setPage(page: Page): Page;
  setSnackBar(payload: ISnackBarView): ISnackBarView;
  toggleLoader(showLoader: boolean): boolean;
  toggleMenu(showMenu: boolean): boolean;
  toggleSetting(show: boolean): boolean;
  toggleSignInButton(show: boolean): boolean;
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
