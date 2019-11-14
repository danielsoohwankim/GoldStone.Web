import axios, { AxiosResponse } from 'axios';
import { Date } from '@/shared/Date';
import { GetAssetsResponseContractV1, IGoldStoneClient, IPutAccountCatalogRequestContractV1,
  IPutAccountCatalogResponseContractV1 } from './IGoldStoneClient';

const baseUrl: string = `https://goldstone.azurewebsites.net`;
const version: string = `v1.0`;

const assetsPath = (userId: string): string => `${basePath(userId)}/assets`;
const basePath = (userId: string): string => `/${version}/users/${userId}`;
const catalogsPath = (userId: string, accountId: string): string =>
  `${basePath(userId)}/accounts/${accountId}/catalogs`;

export const api = axios.create({
  baseURL: baseUrl,
});

class GoldStoneClient implements IGoldStoneClient {
  public async getAssetsAsync(
    userId: string,
    startDate: Date,
    endDate: Date): Promise<AxiosResponse<GetAssetsResponseContractV1>> {
    try {
      return await api.get(`${assetsPath(userId)}?startDate=${startDate.toString()}&endDate=${endDate.toString()}`);
    } catch (e) {
      return e.response;
    }
  }

public async putCatalogAsync(request: IPutAccountCatalogRequestContractV1)
: Promise<AxiosResponse<IPutAccountCatalogResponseContractV1 | string>> {
  const { userId, accountId, date } = request;

  try {
    return await api.put(`${catalogsPath(userId, accountId)}/${date.toString()}`, request);
  } catch (e) {
    return e.response;
  }
}

  // todo: remove
  public async getAdminUserId(): Promise<string|undefined> {
    try {
      const response = await api.get(`/${version}/users/admin`);

      return response.data as string;
    } catch (e) {
      return e.response;
    }
  }
}

export default new GoldStoneClient();
