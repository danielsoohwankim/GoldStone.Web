import { IMenu } from './_interfaces';

export class Menus {
  // empty state for initialization
  public static Empty: IMenu = {
    icon: 'empty',
    name: 'empty',
    path: '/dashboard',
    title: 'GoldStone',
  };

  public static Dashboard: IMenu = {
    icon: 'dashboard',
    name: 'dashboard',
    path: '/dashboard',
    title: 'GoldStone',
  };

  public static Assets: IMenu = {
    icon: 'account_balance',
    name: 'assets',
    path: '/assets',
    title: 'Assets',
  };

  public static Accountant: IMenu = {
    icon: 'credit_card',
    name: 'accountant',
    path: '/accountant',
    title: 'Accountant',
  };

  public static IsValidPath(name: string | null | undefined): boolean {
    if (!name) {
      return false;
    }

    return Menus.paths.has(name);
  }

  public static GetMenu = (menuName: string): IMenu => {
    switch (menuName) {
      case Menus.Dashboard.name:
        return Menus.Dashboard;

      case Menus.Assets.name:
        return Menus.Assets;

      case Menus.Accountant.name:
        return Menus.Accountant;

      default:
        throw new Error(`invalid menu name ${menuName}`);
    }
  }

  private static paths: Set<string>
    = new Set([
      `/`,
      Menus.Dashboard.path,
      Menus.Assets.path,
      Menus.Accountant.path,
    ]);
}

export enum Page {
  Default = 'Default',
  Home = 'Home',
  NotFound = 'NotFound',
}

export enum Theme {
  Light = 'Light',
  Dark = 'Dark',
}
