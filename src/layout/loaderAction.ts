import { AxiosResponse } from 'axios';
import layout from './_store';
import { LoaderCallback, ILoaderAction } from './_interfaces';

class LoaderAction implements ILoaderAction {
  /**
   * exposes the loader during the time window of asynchronous call
   * @param callback
   */
  public async sendAsync(callback: LoaderCallback): Promise<AxiosResponse> {
    layout.toggleLoader(true);

    const response = await callback();

    layout.toggleLoader(false);

    return response;
  }
}

export default new LoaderAction();
