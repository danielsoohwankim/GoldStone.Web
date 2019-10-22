import { IMenu, IMenus } from './_interfaces';

class Menus implements IMenus {
  public dashboard: IMenu = {
    icon: 'dashboard',
    name: 'dashboard',
    route: '/',
    title: 'Dashboard',
  };

  public assets: IMenu = {
    icon: 'account_balance',
    name: 'assets',
    route: '/assets',
    title: 'Assets',
  };

  public accountant: IMenu = {
    icon: 'credit_card',
    name: 'accountant',
    route: '/accountant',
    title: 'Accountant',
  };

  public getMenu = (menuName: string): IMenu => {
    switch (menuName) {
      case this.dashboard.name:
        return this.dashboard;

      case this.assets.name:
        return this.assets;

      case this.accountant.name:
        return this.accountant;

      default:
        throw new Error(`invalid menu name ${menuName}`);
    }
  }
}

export const menus = new Menus();

// tslint:disable-next-line

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}
