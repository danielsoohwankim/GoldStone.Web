export interface IMenu {
  icon: string;
  name: string;
  route: string;
  title: string;
}

export class Menu {
  public static dashboard: IMenu = {
    icon: 'dashboard',
    name: 'dashboard',
    route: '/',
    title: 'Dashboard',
  };

  public static assets: IMenu = {
    icon: 'account_balance',
    name: 'assets',
    route: '/assets',
    title: 'Assets',
  };

  public static accountant: IMenu = {
    icon: 'credit_card',
    name: 'accountant',
    route: '/accountant',
    title: 'Accountant',
  };

  public static getMenu = (menuName: string): IMenu => {
    switch (menuName) {
      case Menu.dashboard.name:
        return Menu.dashboard;

      case Menu.assets.name:
        return Menu.assets;

      case Menu.accountant.name:
        return Menu.accountant;

      default:
        throw new Error(`invalid menu name ${menuName}`);
    }
  }
}
