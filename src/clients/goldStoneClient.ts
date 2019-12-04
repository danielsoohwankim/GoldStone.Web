import axios, { AxiosResponse } from 'axios';
import { storageTools } from '@/shared/_tools';
import { Date } from '@/shared/Date';
import tenant from '@/tenant/_store';
import { UserRole } from '@/tenant/_data';

const authorizationHeader = 'Authorization';
const baseUrl: string = `https://goldstone.azurewebsites.net`;
const bearerToken = (jwt: string) => `Bearer ${jwt}`;
const version: string = `v1.0`;

const accountsPath = (tenantId: string): string => `${basePath(tenantId)}/accounts`;
const basePath = (tenantId: string): string => `/${version}/tenants/${tenantId}`;
const catalogsPath = (tenantId: string, accountId: string): string =>
  `${basePath(tenantId)}/accounts/${accountId}/catalogs`;
const usersPath = (tenantId: string): string => `${basePath(tenantId)}/users`;

const api = axios.create({
  baseURL: baseUrl,
});

class GoldStoneClient {
  public async getAccountsAsync(assetOnly?: boolean): Promise<AxiosResponse<IGetAccountResponseContract[] | any>> {
    this.setJwtToken();

    const path = (assetOnly && assetOnly === true)
      ? `${accountsPath(tenant.id)}?assetOnly=true`
      : accountsPath(tenant.id);

    try {
      return await api.get(path);
    } catch (e) {
      return e.response;
    }
  }

  public async getCatalogsAsync(
    startDate: Date,
    endDate: Date): Promise<AxiosResponse<IGetCatalogResponseContract[] | any>> {
    this.setJwtToken();

    try {
      return await api.get(
        `${basePath(tenant.id)}/account-catalogs?startDate=${startDate.toString()}&endDate=${endDate.toString()}`);
    } catch (e) {
      return e.response;
    }
  }

  public async getUsersAsync(): Promise<AxiosResponse<IGetUserResponseContract[] | any>> {
    this.setJwtToken();

    try {
      return await api.get(usersPath(tenant.id));
    } catch (e) {
      return e.response;
    }
  }

  public async putCatalogAsync(request: IPutAccountCatalogRequestContractV1)
  : Promise<AxiosResponse<IPutAccountCatalogResponseContractV1 | any>> {
    const { accountId, date } = request;
    this.setJwtToken();

    try {
      return await api.put(`${catalogsPath(tenant.id, accountId)}/${date.toString()}`, request);
    } catch (e) {
      return e.response;
    }
  }

  public async signIn(token: string): Promise<AxiosResponse<ISignInResponseContractV1 | any>> {
    this.setJwtToken(token);

    try {
      return await api.post(`/${version}/signin`);
    } catch (e) {
      return e.response;
    }
  }

  private setJwtToken(token?: string): void {
    const accessToken: string = (token) ? token : storageTools.getToken();

    api.defaults.headers.common[authorizationHeader] = bearerToken(accessToken);
  }
}

export default new GoldStoneClient();

export interface IGetAccountResponseContract {
  assetType?: GoldStoneAssetType;
  id: string;
  isTracked: boolean;
  name: string;
  state: GoldStoneAccountState;
  symbol: string;
  tenantId: string;
  userId: string;
}

export interface IGetCatalogResponseContract {
  accountId: string;
  date: Date;
  tenant: string;
  timestamp: number;
  value: number;
}

export interface IGetUserResponseContract {
  id: string;
  tenantId: string;
  profileImageUrl: string;
  role: UserRole;
}

export interface IPutAccountCatalogRequestContractV1 {
  accountId: string;
  date: string;
  value: number;
}

// @ts-ignore
// tslint:disable-next-line
export interface IPutAccountCatalogResponseContractV1
  extends IPutAccountCatalogRequestContractV1 {}

export interface ISignInResponseContractV1 {
  accessToken: string;
  tenantId: string;
  userId: string;
}

export enum GoldStoneAccountState {
  None = 'None',
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum GoldStoneAssetType {
  Cash = 'Cash',
  Investment = 'Investment',
  Retirement = 'Retirement',
}
