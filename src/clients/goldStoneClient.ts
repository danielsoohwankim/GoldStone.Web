import axios, { AxiosResponse } from 'axios';
import { Date } from '@/shared/Date';
import { GetAssetsResponseContractV1, IGoldStoneClient, IPutAccountCatalogRequestContractV1,
  IPutAccountCatalogResponseContractV1, ISignInResponseContractV1 } from './IGoldStoneClient';
import tenant from '@/tenant/_store';

const authorizationHeader = 'Authorization';
const baseUrl: string = `https://goldstone.azurewebsites.net`;
const bearerToken = (jwt: string) => `Bearer ${jwt}`;
const version: string = `v1.0`;

const assetsPath = (tenantId: string): string => `${basePath(tenantId)}/assets`;
const basePath = (tenantId: string): string => `/${version}/tenants/${tenantId}`;
const catalogsPath = (tenantId: string, accountId: string): string =>
  `${basePath(tenantId)}/accounts/${accountId}/catalogs`;

const api = axios.create({
  baseURL: baseUrl,
});

class GoldStoneClient implements IGoldStoneClient {
  public async getAssetsAsync(
    startDate: Date,
    endDate: Date): Promise<AxiosResponse<GetAssetsResponseContractV1 | any>> {
    this.setJwtToken();

    try {
      return await api.get(`${assetsPath(tenant.id)}?startDate=${startDate.toString()}&endDate=${endDate.toString()}`);
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
    const accessToken: string = (token) ? token : tenant.token;

    api.defaults.headers.common[authorizationHeader] = bearerToken(accessToken);
  }
}

export default new GoldStoneClient();
