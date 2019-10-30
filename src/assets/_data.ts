import colors from 'material-colors';
import { IAssetLayout, IAssetsView, IAssetView } from './_interfaces';

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
  Today = 'Today',
  Yesterday = 'Yesterday',
  OneWeek = '1 Week',
  TwoWeeks = '2 Weeks',
  OneMonth = '1 Month',
  ThreeMonths = '3 Months',
  SixMonths = '6 Months',
  OneYear = '1 Year',
  Custom = 'Custom',
}
