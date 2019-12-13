import axios, { AxiosResponse } from 'axios';
import { ExpenseCategory } from '@/accountant/_data';
import { storageTools } from '@/shared/_tools';
import { Date } from '@/shared/Date';
import tenant from '@/tenant/_store';
import { UserRole } from '@/tenant/_data';
// todo: remove
import getTransactionsResponse from '@/accountant/testData.js';

const authorizationHeader = 'Authorization';
const baseUrl: string = `https://goldstone.azurewebsites.net`;
const bearerToken = (jwt: string) => `Bearer ${jwt}`;
const version: string = `v1.0`;

const accountsPath = (tenantId: string): string => `${basePath(tenantId)}/accounts`;
const basePath = (tenantId: string): string => `/${version}/tenants/${tenantId}`;
const catalogsPath = (tenantId: string, accountId: string): string =>
  `${basePath(tenantId)}/accounts/${accountId}/catalogs`;
// todo: remove -test
const transactionsPath = (tenantId: string): string => `${basePath(tenantId)}/transactions-test`;
const usersPath = (tenantId: string): string => `${basePath(tenantId)}/users`;

const api = axios.create({
  baseURL: baseUrl,
});

class GoldStoneClient {
  public async getAccountsAsync(
    isAsset?: boolean,
    isExpense?: boolean,
    ): Promise<AxiosResponse<IGetAccountResponseContractV1[] | any>> {
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
    endDate: Date): Promise<AxiosResponse<IGetCatalogResponseContractV1[] | any>> {
    this.setJwtToken();

    try {
      return await api.get(
        `${basePath(tenant.id)}/account-catalogs?startDate=${startDate.toString()}&endDate=${endDate.toString()}`);
    } catch (e) {
      return e.response;
    }
  }

  public async getUsersAsync(): Promise<AxiosResponse<IGetUserResponseContractV1[] | any>> {
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
  ): Promise<AxiosResponse<IGetTransactionResponseContractV1[] | any>> {
    this.setJwtToken();

    try {
      // return await api.get(`${transactionsPath(tenant.id)}
      // ?startDate=${startDate.toString()}&endDate=${endDate.toString()}`);
      return getTransactionsResponse;
    } catch (e) {
      return e.response;
    }
  }

  public async mergeTransactionsAsync(transactionId: string, pendingId: string)
  : Promise<AxiosResponse<IMergeTransactionResponseContractV1 | any>> {
    this.setJwtToken();

    const data: IMergeTransactionsRequestContractV1 = {
      pendingTransactionId: pendingId,
    };

    try {
      return await api.put(`${transactionsPath(tenant.id)}/${transactionId}/merge`, data);
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
      return await api.put(`${transactionsPath(tenant.id)}/${id}`, request);
    } catch (e) {
      return e.response;
    }
  }

  public async putTransactionsAsync(request: IPutTransactionRequestContractV1[])
  : Promise<AxiosResponse<void | any>> {
    this.setJwtToken();

    try {
      return await api.put(`${transactionsPath(tenant.id)}`, request);
    } catch (e) {
      return e.response;
    }
  }

  public async deleteTransactionsAsync(transactionIds: string[]): Promise<AxiosResponse<void | any>> {
    this.setJwtToken();
    const ids: string = transactionIds.join(',');

    try {
      return await api.delete(`${transactionsPath(tenant.id)}?ids=${ids}`);
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

export interface IGetAccountResponseContractV1 {
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

export interface IGetCatalogResponseContractV1 {
  accountId: string;
  date: Date;
  tenant: string;
  timestamp: number;
  value: number;
}

export interface IGetTransactionResponseContractV1 {
  accountId: string;
  amount: number;
  date: string;
  expenseCategory: ExpenseCategory;
  id: string;
  isPending: boolean;
  mergedDate?: string;
  name: string;
  note: string;
  tenantId: string;
  verifiedDate?: string;
}

export interface IGetUserResponseContractV1 {
  id: string;
  tenantId: string;
  profileImageUrl: string;
  role: UserRole;
}

export interface IMergeTransactionsRequestContractV1 {
  pendingTransactionId: string;
}

export interface IMergeTransactionResponseContractV1 {
  accountId: string;
  amount: number;
  date: string;
  expenseCategory: ExpenseCategory;
  id: string;
  isPending: boolean;
  mergedDate?: string;
  name: string;
  note: string;
  tenantId: string;
  verifiedDate?: string;
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
  verifiedDate?: string;
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
