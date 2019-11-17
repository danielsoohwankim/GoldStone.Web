import axios, { AxiosResponse } from 'axios';
import { Date } from '@/shared/Date';
import { GetAssetsResponseContractV1, IGoldStoneClient, IPutAccountCatalogRequestContractV1,
  IPutAccountCatalogResponseContractV1 } from './IGoldStoneClient';
import user from '@/user/_store';

const authorizationHeader = 'Authorization';
const baseUrl: string = `https://goldstone.azurewebsites.net`;
const bearerToken = (jwt: string) => `Bearer ${jwt}`;
const version: string = `v1.0`;

const assetsPath = (userId: string): string => `${basePath(userId)}/assets`;
const basePath = (userId: string): string => `/${version}/users/${userId}`;
const catalogsPath = (userId: string, accountId: string): string =>
  `${basePath(userId)}/accounts/${accountId}/catalogs`;

const api = axios.create({
  baseURL: baseUrl,
});

class GoldStoneClient implements IGoldStoneClient {
  public async getAssetsAsync(
    startDate: Date,
    endDate: Date): Promise<AxiosResponse<GetAssetsResponseContractV1 | any>> {
    this.setJwtToken();

    try {
      return await api.get(`${assetsPath(user.id)}?startDate=${startDate.toString()}&endDate=${endDate.toString()}`);
    } catch (e) {
      return e.response;
    }
  }

  public async putCatalogAsync(request: IPutAccountCatalogRequestContractV1)
  : Promise<AxiosResponse<IPutAccountCatalogResponseContractV1 | any>> {
    const { accountId, date } = request;
    this.setJwtToken();

    try {
      return await api.put(`${catalogsPath(user.id, accountId)}/${date.toString()}`, request);
    } catch (e) {
      return e.response;
    }
  }

  public async signIn(): Promise<AxiosResponse<string>> {
    this.setJwtToken();

    try {
      return await api.post(`/${version}/signin`);
    } catch (e) {
      return e.response;
    }
  }

  private setJwtToken(): void {
    api.defaults.headers.common[authorizationHeader] = bearerToken(user.token);
  }
}

export default new GoldStoneClient();
