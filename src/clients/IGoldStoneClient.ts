import { AxiosResponse } from 'axios';
import { Date } from '@/shared/Date';

export interface GetAssetsResponseContractV1 {
  assets: GetAssetResponseContractV1[];
  userId: string;
}

export interface GetAssetResponseContractV1 {
  accounts: GetAssetAccountResponseContractV1[];
  assetType: AssetType;
}

export interface GetAssetAccountResponseContractV1 {
  accountCatalogs: GetAssetAccountCatalogResponseContractV1[];
  accountId: string;
  accountName: string;
  accountSymbol: string;
  isTracked: boolean;
}

export interface GetAssetAccountCatalogResponseContractV1 {
  date: string;
  etag: string;
  lastModified: number;
  value: number;
}

export interface IGoldStoneClient {
  getAssetsAsync(startDate: Date, endDate: Date)
    : Promise<AxiosResponse<GetAssetsResponseContractV1 | any>>;
  putCatalogAsync(request: IPutAccountCatalogRequestContractV1)
    : Promise<AxiosResponse<IPutAccountCatalogResponseContractV1 | any>>;
  signIn(): Promise<AxiosResponse<string>>;
}

export interface IPutAccountCatalogRequestContractV1 {
  accountId: string;
  date: string;
  userId: string;
  value: number;
}

// @ts-ignore
// tslint:disable-next-line
export interface IPutAccountCatalogResponseContractV1
  extends IPutAccountCatalogRequestContractV1 {}

export enum AssetType {
  Cash = 'Cash',
  Investment = 'Investment',
  Retirement = 'Retirement',
}
