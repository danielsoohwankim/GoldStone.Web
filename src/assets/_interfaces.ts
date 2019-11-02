import moment from 'moment';
import { Since } from './_data';
import { Date } from '@/shared/Date';
import { GetAssetResponseContractV1 } from '@/clients/IGoldStoneClient';

export interface IAccount {
  accountCatalogMap: IAccountCatalogMap;
  expand: boolean;
  id: string;
  isTracked?: boolean;
  name: string;
  sinceCatalogMap: Map<Since, ISinceCatalog>;
  symbol: string;
}

export interface IAccountCatalog {
  date: string;
  etag: string | null;
  lastModified: number | null;
  balance: number;
}

export interface IAccountCatalogMap {
  catalogMap: Map<string, IAccountCatalog>;
  maxDate: string | null;
  minDate: string | null;
}

export interface IAsset {
  accounts: IAccount[];
  expandChart: boolean;
  googleChart?: object;
  google?: object;
  name: string;
  selectedChartAccountId?: string;
  selectedChartSince: Since;
  title: string;
}

export interface IAssetLayout {
  color: {
    light: IAssetLayoutColor;
    dark: IAssetLayoutColor;
  };
}

export interface IAssetLayoutColor {
  border: string;
  background: string;
  buttonText: string;
  chartBackground: string;
  error: string;
  minus: string;
  neutral: string;
  plus: string;
  success: string;
  warning: string;
  text: string;
}

export interface IAssetsStore {
  assets: IAsset[];
  sinces: Since[];
  maxSince: Since;
  selectChartAccount(payload: object): any;
  selectChartSince(payload: object): any;
  selectSince(sinceKey: string): any;
  setAssets(assets: IAsset[]): any;
  toggleExpandAccount(payload: object): any;
  toggleExpandChart(payload: object): any;
}

export interface IAssetView {
  color: {
    light: {
      default: string,
      font: string,
    },
    dark: {
      default: string,
      font: string,
    },
  };
  icon: string;
  expanded: boolean;
  name: string;
  symbol?: string;
  title: string;
}

export interface IAssetsView {
  assets: IAssetView;
  cash: IAssetView;
  investment: IAssetView;
  layout: IAssetLayout;
  liquid: IAssetView;
  retirement: IAssetView;
}

export interface IAssetTools {
  convertToAssets(goldStoneAssets: GetAssetResponseContractV1[]): IAsset[];
  createTotalAccount(accounts: IAccount[], assetName: string): IAccount;
  createTotalAsset(assets: IAsset[]): IAsset;
  getAsset(assetName: string): IAsset;
  getAccount(assetName: string, accountId: string): IAccount;
  getDate(since: Since): Date;
  toCurrencyString(num: number): string;
  toggleExpandChart(asset: IAsset): void;
}

export interface IChart {
  drawChart(
    asset: IAsset,
    assetView: IAssetView,
    account: IAccount): void;
}

export interface ISinceCatalog {
  balance: number;
  changeAmount: number;
  changePercent: number;
  date: string;
  updatedTime?: moment.Moment | null;
  since: Since;
}
