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
