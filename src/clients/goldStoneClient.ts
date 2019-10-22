import axios from 'axios';
import { Date } from '@/shared/Date';
import { GetAssetsResponseContractV1, IGoldStoneClient } from './IGoldStoneClient';

const baseUrl: string = `https://goldstone.azurewebsites.net`;
const version: string = `v1.0`;

const assetsPath = (userId: string): string => `${basePath(userId)}/assets`;
const basePath = (userId: string): string => `/${version}/users/${userId}`;

export const api = axios.create({
  baseURL: baseUrl,
});

class GoldStoneClient implements IGoldStoneClient {
  public async getAssets(
    userId: string,
    startDate: Date,
    endDate: Date): Promise<GetAssetsResponseContractV1[]|undefined> {
    try {
      const response = await api.get(`${assetsPath(userId)}?startDate=${startDate.toString()}&endDate=${endDate.toString()}`);

      return response.data as GetAssetsResponseContractV1[];
    } catch (e) {
      this.handleError(e);
    }
  }
  // todo: remove
  public async getAdminUserId(): Promise<string|undefined> {
    try {
      const response = await api.get(`/${version}/users/admin`);

      return response.data as string;
    } catch (e) {
      this.handleError(e);
    }
  }

  private handleError(e): void {
    // tslint:disable-next-line
    console.error(e);

    throw e;
  }
}

export default new GoldStoneClient();
