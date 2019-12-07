import axios, { AxiosResponse } from 'axios';
import { ExpenseCategory, TransactionState } from '@/accountant/_data';
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
const transactionsPath = (tenantId: string): string => `${basePath(tenantId)}/transactions`;
const usersPath = (tenantId: string): string => `${basePath(tenantId)}/users`;

const api = axios.create({
  baseURL: baseUrl,
});

class GoldStoneClient {
  public async getAccountsAsync(
    isAsset?: boolean,
    isExpense?: boolean,
    ): Promise<AxiosResponse<IGetAccountResponseContract[] | any>> {
    this.setJwtToken();

    let path = accountsPath(tenant.id);

    if (isAsset && isAsset === true) {
      path = `${path}?isAsset=true`;

      if (isExpense && isExpense === true) {
        path = `${path}&isExpense=true`;
      }
    } else if (isExpense && isExpense === true) {
      path = `${path}?isExpense=true`;
    }

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

  public async getTransactionsAsync(
    startDate: Date,
    endDate: Date,
  ): Promise<AxiosResponse<IGetTransactionResponseContract[] | any>> {
    this.setJwtToken();

    try {
      return await api.get(`${transactionsPath(tenant.id)}?startDate=${startDate.toString()}&endDate=${endDate.toString()}`);
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

  public async putTransactionAsync(request: IPutTransactionRequestContractV1)
  : Promise<AxiosResponse<void | any>> {
    const { id } = request;
    this.setJwtToken();

    try {
      // todo: remove test
      return await api.put(`${transactionsPath(tenant.id)}/${id}/test`, request);
    } catch (e) {
      return e.response;
    }
  }

  public async putTransactionsAsync(request: IPutTransactionRequestContractV1[])
  : Promise<AxiosResponse<void | any>> {
    this.setJwtToken();

    try {
      return await api.put(`${transactionsPath(tenant.id)}/test`, request);
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
  expenseType?: GoldStoneExpenseType;
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

export interface IGetTransactionResponseContract {
  accountId: string;
  amount: number;
  date: string;
  expenseCategory: ExpenseCategory;
  id: string;
  name: string;
  note: string;
  tenantId: string;
  transactionState: TransactionState;
  verified: boolean;
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
  userProfileImageUrl: string;
  userRole: UserRole;
}

export interface IPutTransactionRequestContractV1 {
  accountId: string;
  amount: number;
  date: string;
  expenseCategory: ExpenseCategory;
  id: string;
  name: string;
  note: string;
  tenantId: string;
  transactionState: TransactionState;
  verified: boolean;
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

export enum GoldStoneExpenseType {
  Cash = 'Cash',
  Checking = 'Checking',
  Credit = 'Credit',
  Saving = 'Saving',
}
