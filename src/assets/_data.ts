import colors from 'material-colors';
import { IAssetLayout, IAssetsView, IAssetView } from './_interfaces';
import { Date } from '@/shared/Date';
import { goldStoneException } from '@/shared/GoldStoneException';

const shadeLightDefault: number = 500;
const shadeLightFont: string = 'a700';
const shadeDarkDefault: number = 700;
const shadeDarkFont: string = '400';

class AssetsConstants {
  public startDateOffset: number = -14;
  public totalAccountId: string = 'total';
  public totalName: string = 'Total';
  public totalSymbol: string = 'TOTAL';
  public updateToleranceMinutes: number = 305;
}

export const assetsConstants = new AssetsConstants();
// tslint:disable-next-line
class AssetsView implements IAssetsView {
  public assets: IAssetView = {
    // color: '#007bff',
    color: {
      light: {
        default: colors.cyan[shadeLightDefault],
        font: colors.cyan[shadeLightFont],
      },
      dark: {
        default: colors.cyan[shadeDarkDefault],
        font: colors.cyan[shadeDarkFont],
      },
    },
    icon: 'account_balance',
    expanded: true,
    name: 'assets',
    title: 'Assets',
  };

  public cash: IAssetView = {
    // color: '#007bff',
    color: {
      light: {
        default: colors.blue[shadeLightDefault],
        font: colors.blue[shadeLightFont],
      },
      dark: {
        default: colors.blue[shadeDarkDefault],
        font: colors.blue[shadeDarkFont],
      },
    },
    icon: 'monetization_on',
    expanded: false,
    name: 'cash',
    symbol: 'CASH',
    title: 'Cash',
  };

  public investment: IAssetView = {
    // color: '#dc3545',
    color: {
      light: {
        default: colors.red[shadeLightDefault],
        font: colors.red[shadeLightFont],
      },
      dark: {
        default: colors.red[shadeDarkDefault],
        font: colors.red[shadeDarkFont],
      },
    },
    icon: 'insert_chart_outlined',
    expanded: false,
    name: 'investment',
    symbol: 'INVEST',
    title: 'Investment',
  };

  public layout: IAssetLayout = {
    color: {
      light: {
        border: '#0000001A',
        background: '#e9ecef',
        buttonText: 'white',
        chartBackground: 'white',
        error: colors.red[600],
        minus: colors.red[600],
        neutral: colors.grey[500],
        plus: colors.green[600],
        success: colors.grey[600],
        warning: colors.yellow[700],
        text: 'black',
      },
      dark: {
        border: '#ffffff1A',
        background: '#373740',
        buttonText: '#424242',
        chartBackground: '#424242',
        error: colors.red[400],
        minus: colors.red.a200,
        neutral: colors.blueGrey[300],
        plus: colors.green.a400,
        success: colors.blueGrey[300],
        warning: colors.yellow[300],
        text: 'white',
      },
    },
  };

  public liquid: IAssetView = {
    // color: '#dc3545',
    color: {
      light: {
        default: colors.grey[shadeLightDefault],
        font: colors.grey[shadeLightFont],
      },
      dark: {
        default: colors.grey[shadeDarkDefault],
        font: colors.grey[shadeDarkFont],
      },
    },
    icon: 'insert_chart_outlined',
    expanded: false,
    name: 'liquid',
    symbol: 'LIQUID',
    title: 'Liquid',
  };

  public retirement: IAssetView = {
    // color: '#009933',
    color: {
      light: {
        default: colors.green[shadeLightDefault],
        font: colors.green[shadeLightFont],
      },
      dark: {
        default: colors.green[shadeDarkDefault],
        font: colors.green[shadeDarkFont],
      },
    },
    icon: 'cloud',
    expanded: false,
    name: 'retirement',
    symbol: 'RETIRE',
    title: 'Retirement',
  };
}

export const assetsView = new AssetsView();

export enum Since {
  Custom,
  OneYear,
  SixMonths,
  ThreeMonths,
  OneMonth,
  TwoWeeks,
  OneWeek,
  Yesterday,
  Today,
}
// tslint:disable-next-line
class Sinces {
  // get enum string keys
  public static keys(): string[] {
    return Object.keys(Since).filter((key) => !isNaN(Number(Since[key])));
  }

  public static getDate(since: Since | string): Date {
    const today: Date = Date.Today();

    switch (since) {
      case Since.Today:
      case Since[Since.Today]:
        return today;
      case Since.Yesterday:
      case Since[Since.Yesterday]:
        return today.addDays(-1);
      case Since.OneWeek:
      case Since[Since.OneWeek]:
        return today.addWeeks(-1);
      case Since.TwoWeeks:
      case Since[Since.TwoWeeks]:
        return today.addWeeks(-2);
      case Since.OneMonth:
      case Since[Since.OneMonth]:
        return today.addMonths(-1);
      case Since.ThreeMonths:
      case Since[Since.ThreeMonths]:
        return today.addMonths(-3);
      case Since.SixMonths:
      case Since[Since.SixMonths]:
        return today.addMonths(-6);
      case Since.OneYear:
      case Since[Since.OneYear]:
        return today.addYears(-1);
    }

    throw new goldStoneException(`invalid since type ${since}`);
  }

  public static size(): number {
    // need to use !isNan to filter out string keys
    return Object.keys(Since).filter((key) => !isNaN(Number(Since[key]))).length;
  }

  public static toString(since: Since | string) {
    switch (since) {
      case Since.Custom:
      case Since[Since.Custom]:
        return 'Custom';
      case Since.OneYear:
      case Since[Since.OneYear]:
        return '1 Year';
      case Since.SixMonths:
      case Since[Since.SixMonths]:
        return '6 Months';
      case Since.ThreeMonths:
      case Since[Since.ThreeMonths]:
        return '3 Months';
      case Since.OneMonth:
      case Since[Since.OneMonth]:
        return '1 Month';
      case Since.TwoWeeks:
      case Since[Since.TwoWeeks]:
        return '2 Weeks';
      case Since.OneWeek:
      case Since[Since.OneWeek]:
        return '1 Week';
      case Since.Yesterday:
      case Since[Since.Yesterday]:
        return 'Yesterday';
      case Since.Today:
      case Since[Since.Today]:
        return 'Today';
    }

    throw new goldStoneException(`invalid since ${since}`);
  }

  // get numeric values
  public static values(): Since[] {
    return (this.keys().map((key) => Since[key as any]) as unknown) as Since[];
  }
}

export { Sinces };
