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
}

export interface GetAssetAccountCatalogResponseContractV1 {
  date: string;
  etag: string;
  lastModified: number;
  value: number;
}

export interface IGoldStoneClient {
  getAssets(userId: string, startDate: Date, endDate: Date): Promise<GetAssetsResponseContractV1[]|undefined>;
  getAdminUserId(): Promise<string|undefined>;
}

export enum AssetType {
  Cash = 'Cash',
  Investment = 'Investment',
  Retirement = 'Retirement',
}
