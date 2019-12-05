import { AxiosResponse } from 'axios';
import HttpStatus from 'http-status-codes';
import _ from 'lodash';
import { Menus, Theme } from '@/layout/_data';
import layout from '@/layout/_store';
import { goldStoneException } from '@/shared/GoldStoneException';
import SharedConstants from '@/shared/_constants';
import tenant from '@/tenant/_store';

class SharedManager {
  public getAmountColor(amount: number, theme: Theme): string {
    const color: string =
      (amount === 0) ? 'Neutral' :
      (amount > 0) ? 'Plus' : 'Minus';

    return SharedConstants.Number.Colors[theme][color];
  }

  public getFormattedAmount(amount: number): string {
    const sign: string = (amount >= 0) ? '+' : '-';
    const formattedAmount: string = this.toCurrencyString(Math.abs(amount));

    return `${sign}$${formattedAmount}`;
  }

  public handleApiResponse(response: AxiosResponse<any>): {
    success: boolean;
    statusCode: number;
  } {
    let success: boolean = true;

    if (response.status === HttpStatus.UNAUTHORIZED) {
      // tslint:disable-next-line
      console.log(response);

      tenant.signOut(Menus.Assets.path);

      success = false;
    } else if (response.status !== HttpStatus.OK) {
      // failed to get catalogs
      // tslint:disable-next-line
      console.log(response);

      layout.setSnackBar({
        duration: Infinity,
        message: response.data as string,
        show: true,
      });

      success = false;
    }

    return {
      success,
      statusCode: response.status,
    };
  }

  public handleInitApiResponse(response: AxiosResponse<any>): {
    success: boolean;
    statusCode: number;
  } {
    if (response.status !== HttpStatus.OK) {
      // tslint:disable-next-line
      console.log(response);

      layout.setSnackBar({
        duration: Infinity,
        // todo - construct customMessage and errorMessage
        message: response.data as string,
        show: true,
      });
    }

    return {
      success: 200 <= response.status && response.status < 300,
      statusCode: response.status,
    };
  }

  public toCurrencyString(num: number): string {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

export default new SharedManager();
