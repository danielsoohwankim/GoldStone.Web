import { AxiosResponse } from 'axios';
import HttpStatus from 'http-status-codes';
import _ from 'lodash';
import moment from 'moment';
import { Theme } from '@/layout/_data';
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

  public getUtcNowDateTime(): Date {
    return moment.utc().toDate();
  }

  public getUtcNowDateTimeStr(): string {
    return moment.utc().toDate().toJSON();
  }

  public handleApiResponse(response: AxiosResponse<any>, path?: string): {
    success: boolean;
    statusCode: number;
  } {
    let success: boolean = true;

    if (response.status === HttpStatus.UNAUTHORIZED) {
      // tslint:disable-next-line
      console.log(response);

      tenant.signOut(path);

      success = false;
    } else if (this.isSuccessfulStatusCode(response.status) === false) {
      // failed to get catalogs
      // tslint:disable-next-line
      console.log(response);

      layout.setSnackBar({
        isSuccess: false,
        message: `${response.status}: ${JSON.stringify(response.data)}`,
        show: true,
      });

      success = false;
    }

    return {
      success,
      statusCode: response.status,
    };
  }

  public handleDeleteApiResponse(response: AxiosResponse<any>, path?: string): {
    success: boolean;
    statusCode: number;
  } {
    let success: boolean = true;

    if (response.status === HttpStatus.UNAUTHORIZED) {
      // tslint:disable-next-line
      console.log(response);

      tenant.signOut(path);

      success = false;
    } else if (this.isSuccessfulStatusCode(response.status) === false
              && response.status !== HttpStatus.NOT_FOUND) {
      // failed to get catalogs
      // tslint:disable-next-line
      console.log(response);

      layout.setSnackBar({
        isSuccess: false,
        message: `${response.status}: ${JSON.stringify(response.data)}`,
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
    if (this.isSuccessfulStatusCode(response.status) === false) {
      // tslint:disable-next-line
      console.log(response);

      layout.setSnackBar({
        isSuccess: false,
        message: `${response.status}: ${JSON.stringify(response.data)}`,
        show: true,
      });
    }

    return {
      success: this.isSuccessfulStatusCode(response.status),
      statusCode: response.status,
    };
  }

  public isSuccessfulStatusCode(statusCode: number): boolean {
    return (200 <= statusCode && statusCode < 300) || statusCode === HttpStatus.NOT_MODIFIED;
  }

  public toCurrencyString(num: number): string {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

export default new SharedManager();
