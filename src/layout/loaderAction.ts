import { AxiosResponse } from 'axios';
import HttpStatus from 'http-status-codes';
import store from './_store';
import { LoaderCallback, ILoaderAction } from './_interfaces';

class LoaderAction implements ILoaderAction {
  /**
   * exposes the loader during the time window of asynchronous call
   * @param callback
   */
  public async sendAsync(callback: LoaderCallback): Promise<AxiosResponse> {
    store.toggleLoader(true);

    const response = await callback();

    store.toggleLoader(false);

    return response;
  }
}

export default new LoaderAction();
