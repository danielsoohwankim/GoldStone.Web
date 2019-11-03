import moment from 'moment';
import { GetAssetResponseContractV1 } from '@/clients/IGoldStoneClient';

export interface IAccount {
  accountCatalogMap: IAccountCatalogMapWrapper;
  expand: boolean;
  id: string;
  isTracked?: boolean;
  name: string;
  sinceCatalogMap: ISinceCatalogMap;
  symbol: string;
}

export interface IAccountCatalog {
  date: string;
  etag: string | null;
  lastModified: number | null;
  balance: number;
}

export interface IAccountCatalogMap {
  [ key: string ]: IAccountCatalog;
}

export interface IAccountCatalogMapWrapper {
  catalogMap: IAccountCatalogMap;
  maxDate: string | null;
  minDate: string | null;
}

export interface IAccountMap {
  [key: string]: IAccount;
}

export interface IAsset {
  accountMap: IAccountMap;
  expandChart: boolean;
  googleChart?: object;
  google?: object;
  name: string;
  selectedChartAccountId?: string;
  selectedChartSince: string;
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
  sinces: string[];
  maxSince: string;
  selectChartAccount(payload: object): any;
  selectChartSince(payload: object): any;
  selectSince(sinceKey: string): Promise<any>;
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
  createTotalAccount(accountMap: IAccountMap, assetName: string): IAccount;
  createTotalAsset(assets: IAsset[]): IAsset;
  getAccount(assetName: string, accountId: string): IAccount;
  getAsset(assetName: string): IAsset;
  getAssets(since: string): Promise<IAsset[]>;
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
  since: string;
}

export interface ISinceCatalogMap {
  [key: string]: ISinceCatalog;
}
