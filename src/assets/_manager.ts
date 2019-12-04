import { AxiosResponse } from 'axios';
import HttpStatus from 'http-status-codes';
import _ from 'lodash';
import AssetConstants from './_constants';
import { AssetType, IAccount, ICatalog } from './_store';
import {
  IGetCatalogResponseContract,
  IGetAccountResponseContract,
  GoldStoneAssetType } from '@/clients/goldStoneClient';
import { Menus } from '@/layout/_data';
import layout from '@/layout/_store';
import { goldStoneException } from '@/shared/GoldStoneException';
import tenant from '@/tenant/_store';

class AssetManager {
  public convertToAccount(item: IGetAccountResponseContract): IAccount {
    return {
      assetType: this.getAssetType(item.assetType!),
      id: item.id,
      isTracked: item.isTracked,
      name: item.name,
      symbol: item.symbol,
      userId: item.userId,
    };
  }

  public convertToCatalog(item: IGetCatalogResponseContract): ICatalog {
    return {
      accountId: item.accountId,
      balance: item.value,
      date: item.date.toString(),
      lastModified: item.timestamp,
    };
  }

  public getTotalAssetId(assetType: AssetType): string {
    if (assetType === AssetType.Assets) {
      return AssetType.Assets;
    }

    return `${assetType}-${AssetConstants.Total.Name}`;
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

  public isTotalAssetId(id: string): boolean {
    return id.includes(AssetConstants.Total.Name);
  }

  public toCurrencyString(num: number): string {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  private getAssetType(gsAssetType: GoldStoneAssetType): AssetType {
    switch (gsAssetType) {
      case GoldStoneAssetType.Cash:
        return AssetType.Cash;

      case GoldStoneAssetType.Investment:
        return AssetType.Investment;

      case GoldStoneAssetType.Retirement:
        return AssetType.Retirement;
    }

    throw new goldStoneException('Unknown GoldStoneAssetType');
  }
}

export default new AssetManager();
