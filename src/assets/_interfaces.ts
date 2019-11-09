import moment from 'moment';

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
  id: string;
  expandChart: boolean;
  googleChart?: object;
  google?: object;
  name: string;
  selectedChartAccountId?: string;
  selectedChartSince: string;
  title: string;
}

// keeps track of only the changes (diff) made to an asset
export interface IAssetChange {
  assetId: string;
  accountMap: IAccountMap;
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
  editButtonBackground: string;
  error: string;
  minus: string;
  neutral: string;
  plus: string;
  success: string;
  warning: string;
  text: string;
}

export interface IAssetMap {
  [ key: string ]: IAsset;
}

export interface IAssetsStore {
  assetMap: IAssetMap;
  editDialogView: IEditDialogView;
  isLoaded: boolean;
  sinces: string[];
  minSince: string;
  resetEditView(): void;
  selectChartAccount(payload: ISelectChartAccount): ISelectChartAccount;
  selectChartSince(payload: ISelectChartSince): Promise<ISelectChartSince>;
  selectEditItem(payload: ISelectEditItem): ISelectEditItem;
  selectSince(sinceKey: string): Promise<void>;
  setAssetMap(assetMap: IAssetMap): IAssetMap;
  toggleEditDialog(payload: IToggleEditDialog): IToggleEditDialog;
  toggleExpandAccount(payload: IToggleExpandAccount): IToggleExpandAccount;
  toggleExpandChart(payload: IToggleExpandChart): IToggleExpandChart;
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
  expanded: boolean;
  icon: string;
  id: string;
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
  getAssetMapAsync(userId: string, since: string): Promise<IAssetMap>;
  toCurrencyString(num: number): string;
}

export interface IChart {
  drawChart(
    asset: IAsset,
    assetView: IAssetView,
    account: IAccount): void;
}

export interface IEditDialogView {
  assetAccountMap: {
    [ key: string ]: string | undefined,
  };
  assetId: string | undefined;
  show: boolean;
}

export interface ISelectChartAccount {
  assetId: string;
  accountId: string;
}

export interface ISelectEditItem {
  id: string;
  type: string;
  value: string;
}

export interface ISelectChartSince {
  assetId: string;
  since: string;
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

export interface IToggleEditDialog {
  assetId?: string;
  accountId?: string;
  accountName?: string;
  show: boolean;
}

export interface IToggleExpandAccount {
  assetId: string;
  accountId: string;
  expand: boolean;
}

export interface IToggleExpandChart {
  assetId: string;
  expand: boolean;
}
