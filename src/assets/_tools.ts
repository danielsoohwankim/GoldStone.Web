import { AxiosResponse } from 'axios';
import HttpStatus from 'http-status-codes';
import _ from 'lodash';
import moment from 'moment';
import { assetsConstants, assetsView, Since, Sinces } from './_data';
import { IAccount, IAccountCatalog, IAccountCatalogMap, IAccountCatalogMapWrapper,
  IAccountMap, IAsset, IAssetMap, IAssetTools, ISinceCatalog, ISinceCatalogMap } from './_interfaces';
import store from './_store';
import {
  GetAssetResponseContractV1,
  GetAssetsResponseContractV1,
  GetAssetAccountResponseContractV1,
  GetAssetAccountCatalogResponseContractV1,
} from '@/clients/IGoldStoneClient';
import goldStoneClient from '@/clients/goldStoneClient';
import layoutStore from '@/layout/_store';
import { Date } from '@/shared/Date';
import { goldStoneException } from '@/shared/GoldStoneException';

class AssetTools implements IAssetTools {
  public async getAssetMapAsync(userId: string, since: string): Promise<IAssetMap> {
    const startDate: Date = Sinces.getDate(since);
    const endDate: Date = Date.Today();

    layoutStore.toggleLoader(true);

    const response: AxiosResponse<GetAssetsResponseContractV1>
      = await goldStoneClient.getAssetsAsync(userId, startDate, endDate);

    layoutStore.toggleLoader(false);

    if (response.status !== HttpStatus.OK) {
      // todo
      throw new goldStoneException(`failed to get assets`);
    }

    const assets: GetAssetResponseContractV1[] = response.data.assets;
    const assetMap: IAssetMap = this.convertToAssetMap(assets);
    const totalAsset: IAsset = this.createTotalAsset(assetMap);

    assetMap[totalAsset.id] = totalAsset;

    return assetMap;
  }

  public toCurrencyString(num: number): string {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  public getPastSinceCatalog(
    pastValue: number,
    todayValue: number,
    since: string)
  : ISinceCatalog {
    return {
      balance: pastValue,
      changeAmount: this.getChangeAmount(todayValue, pastValue),
      changePercent: this.getChangePercent(todayValue, pastValue),
      date: Sinces.getDate(since).toString(),
      since,
    };
  }

  public getTodaySinceCatalog(
    todayValue: number,
    yesterdayValue: number,
    lastModified: number | null)
  : ISinceCatalog {
    return {
      balance: todayValue,
      changeAmount: this.getChangeAmount(todayValue, yesterdayValue),
      changePercent: this.getChangePercent(todayValue, yesterdayValue),
      date: Date.Today().toString(),
      updatedTime: (lastModified) ? moment.unix(lastModified!) : null,
      since: Since[Since.Today],
    };
  }

  private convertToAsset(goldStoneAsset: GetAssetResponseContractV1): IAsset {
    const assetId: string = goldStoneAsset.assetType.toLowerCase();

    return {
      accountMap: this.convertToAccounts(assetId, goldStoneAsset.accounts),
      id: assetId,
      expandChart: false,
      name: goldStoneAsset.assetType.toLowerCase(),
      selectedChartAccountId: assetsConstants.totalId,
      selectedChartSince: Since[Since.TwoWeeks],
      title: goldStoneAsset.assetType,
    };
  }

  private convertToAccounts(
    assetId: string,
    goldStoneAccounts: GetAssetAccountResponseContractV1[])
  : IAccountMap {
    const accountMap: IAccountMap = {};
    const accounts: IAccount[] =
      goldStoneAccounts
        .filter((account) => account) // defined
        .map((account) => this.convertToAccount(assetId, account));

    accounts.forEach((a) => accountMap[a.id] =  a);

    return accountMap;
  }

  private convertToAccount(
    assetId: string,
    goldStoneAccount: GetAssetAccountResponseContractV1): IAccount {
    return {
      accountCatalogMap: this.convertToAccountCatalogMap(goldStoneAccount.accountCatalogs),
      expand: false,
      id: goldStoneAccount.accountId,
      isTracked: goldStoneAccount.isTracked,
      name: goldStoneAccount.accountName,
      sinceCatalogMap:
        this.convertToSinceCatalogMap(
          assetId,
          goldStoneAccount.accountId,
          goldStoneAccount.accountCatalogs),
      symbol: goldStoneAccount.accountSymbol,
    };
  }

  private convertToAccountCatalog(goldStoneAccountCatalog: GetAssetAccountCatalogResponseContractV1)
  : IAccountCatalog {
    return {
      date: goldStoneAccountCatalog.date,
      etag: goldStoneAccountCatalog.etag,
      lastModified: goldStoneAccountCatalog.lastModified,
      balance: goldStoneAccountCatalog.value,
    };
  }

  private convertToAccountCatalogMap(goldStoneAccountCatalogs: GetAssetAccountCatalogResponseContractV1[])
  : IAccountCatalogMapWrapper {
    goldStoneAccountCatalogs =
      goldStoneAccountCatalogs.filter((accountCatalog) => accountCatalog);

    const catalogMap: IAccountCatalogMap = {};

    if (!goldStoneAccountCatalogs || goldStoneAccountCatalogs.length <= 0) {
      return {
        catalogMap,
        minDate: null,
        maxDate: null,
      };
    }

    goldStoneAccountCatalogs.forEach((ac) => {
      const accountCatalog: IAccountCatalog
        = this.convertToAccountCatalog(ac);
      catalogMap[accountCatalog.date] = accountCatalog;
    });

    return {
      catalogMap,
      minDate: goldStoneAccountCatalogs[0].date,
      maxDate: goldStoneAccountCatalogs[goldStoneAccountCatalogs.length - 1].date,
    };
  }

  private convertToAssetMap(goldStoneAssets: GetAssetResponseContractV1[]): IAssetMap {
    const assetMap: IAssetMap = {};

    goldStoneAssets
      .filter((a) => a) // defined
      .forEach((a) => {
        const asset: IAsset = this.convertToAsset(a);
        assetMap[asset.id] = asset;
      });

    return assetMap;
  }

  private convertToSinceCatalogMap(
    assetId: string,
    accountId: string,
    goldStoneAccountCatalogs: GetAssetAccountCatalogResponseContractV1[])
  : ISinceCatalogMap {
    goldStoneAccountCatalogs =
      goldStoneAccountCatalogs.filter((accountCatalog) => accountCatalog);

    const today: Date = Date.Today();
    const account: IAccount = store.assetMap[assetId].accountMap[accountId];

    const todayCatalog: GetAssetAccountCatalogResponseContractV1 | undefined
      = goldStoneAccountCatalogs.find((ac) => ac.date === today.toString());
    const todayValue: number =
      (todayCatalog) ? todayCatalog.value
        : (account)
          ? account.sinceCatalogMap[Since[Since.Today]].balance
          : 0;

    const todayLastModified: number | null =
      (todayCatalog) ? todayCatalog.lastModified : null;
    const yesterdayCatalog: GetAssetAccountCatalogResponseContractV1 | undefined
      = goldStoneAccountCatalogs.find((ac) => ac.date === today.addDays(-1).toString());
    const yesterdayValue: number = (yesterdayCatalog) ? yesterdayCatalog.value : 0;

    const sinceCatalogMap: ISinceCatalogMap = {};
    const todaySinceCatalog: ISinceCatalog =
      this.getTodaySinceCatalog(
        todayValue,
        yesterdayValue,
        todayLastModified);

    sinceCatalogMap[Since[Since.Today]] = todaySinceCatalog;

    store.sinces.forEach((since) => {
      if (since === Since[Since.Today]) {
        return;
      }

      const date: Date = Sinces.getDate(since);
      const catalog: GetAssetAccountCatalogResponseContractV1 | undefined
        = goldStoneAccountCatalogs.find(
          (ac) => ac.date === date.toString());

      const pastValue: number = (catalog) ? catalog.value : 0;
      const pastSinceCatalog: ISinceCatalog =
        this.getPastSinceCatalog(pastValue, todayValue, since);

      sinceCatalogMap[since] = pastSinceCatalog;
    });

    return sinceCatalogMap;
  }

  private createLiquidAccount(totalAsset: IAsset): IAccount {
    const liquidAccountMap: IAccountMap = _.cloneDeep(totalAsset.accountMap);
    delete liquidAccountMap[assetsView.retirement.name];

    const liquidAccount: IAccount =
      this.createTotalAccount(liquidAccountMap, assetsConstants.liquidName);

    liquidAccount.id = assetsView.liquid.name;
    liquidAccount.name = assetsView.liquid.title;
    liquidAccount.symbol = assetsView.liquid.symbol!;

    return liquidAccount;
  }

  private createTotalAccount(accountMap: IAccountMap, assetName: string): IAccount {
    const sinceCatalogsMap: {[ key: string ]: ISinceCatalog[]} = this.getSinceCatalogsMap(accountMap);
    // create total catalog
    const sinceCatalogMap: ISinceCatalogMap = {};

    store.sinces.forEach(
      (since) =>
      sinceCatalogMap[since] = this.createTotalSinceCatalog(sinceCatalogsMap[since]));

      // calculate changePercent
    const todayCatalog: ISinceCatalog = sinceCatalogMap[Since[Since.Today]];
    const todayBalance: number = todayCatalog.balance;

    Object.keys(sinceCatalogMap).forEach((since) => {
      const sinceCatalog: ISinceCatalog = sinceCatalogMap[since];
      if (since === Since[Since.Today]) {
        const yesterdayCatalog: ISinceCatalog = sinceCatalogMap[Since[Since.Yesterday]];
        const yesterdayBalance: number = (yesterdayCatalog) ? yesterdayCatalog.balance : 0;

        sinceCatalog.changePercent = this.getChangePercent(todayBalance, yesterdayBalance);
      } else {
        sinceCatalog.changePercent = this.getChangePercent(todayBalance, sinceCatalog.balance);
      }
    });

    return {
      // todo
      accountCatalogMap: this.getTotalAccountCatalogMap(accountMap),
      expand: false,
      id: assetsConstants.totalId,
      name: `${assetName} ${assetsConstants.totalName}`,
      sinceCatalogMap,
      symbol: assetsConstants.totalSymbol,
    };
  }

  private createTotalAsset(assetMap: IAssetMap): IAsset {
    const totalAsset: IAsset = {
      accountMap: {},
      expandChart: false,
      id: assetsView.assets.id,
      name: assetsView.assets.name,
      selectedChartAccountId: assetsConstants.totalId,
      selectedChartSince: Since[Since.TwoWeeks],
      title: assetsView.assets.title,
    };

    Object.values(assetMap).forEach((asset) => {
      const totalAccount: IAccount =
        this.createTotalAccount(asset.accountMap, asset.title);

      asset.accountMap[totalAccount.id] = totalAccount;

      const totalAccountClone: IAccount = _.cloneDeep(totalAccount);
      totalAccountClone.id = asset.name;
      totalAccountClone.name = asset.title;
      totalAccountClone.symbol = assetsView[asset.name].symbol;
      totalAsset.accountMap[totalAccountClone.id] = totalAccountClone;
    });

    // create liquid and total accounts
    const liquidAccount: IAccount =
      this.createLiquidAccount(totalAsset)!;
    const totalTotalAccount: IAccount =
      this.createTotalAccount(totalAsset.accountMap, '');
    totalTotalAccount.name = assetsConstants.totalName;

    totalAsset.accountMap[liquidAccount.id] = liquidAccount;
    totalAsset.accountMap[totalTotalAccount.id] = totalTotalAccount;

    return totalAsset;
  }

  private createTotalSinceCatalog(sinceCatalogs: ISinceCatalog[])
  : ISinceCatalog {
    let balance: number = 0;
    let changeAmount: number = 0;

    sinceCatalogs.forEach((ac) => {
      balance += ac.balance;
      changeAmount += ac.changeAmount;
    });

    return {
      balance,
      changeAmount,
      changePercent: 0, // calculate later
      date: sinceCatalogs[0].date,
      updatedTime: null,
      since: sinceCatalogs[0].since,
    };
  }

  private getChangeAmount(curValue: number, prevValue: number): number {
    return Math.round((curValue - prevValue) * 100) / 100;
  }

  private getChangePercent(curValue: number, prevValue: number): number {
    const changePercent: number =
      (curValue > prevValue)
        ? (prevValue === 0)
          ? 0
          : ((curValue / prevValue) - 1) * 100
        : (curValue === 0)
          ? 0
          : ((prevValue / curValue) - 1) * 100;

    return Math.round((changePercent) * 100) / 100;
  }

  private getSinceCatalogsMap(accountMap: IAccountMap)
  : {[ key: string ]: ISinceCatalog[]} {
    const catalogsMap: {[ key: string ]: ISinceCatalog[]} = {};
    Object.values(accountMap).forEach((a) => {
      Object.keys(a.sinceCatalogMap).forEach((since) => {
        if (!catalogsMap[since]) {
          catalogsMap[since] = [];
        }

        catalogsMap[since].push(a.sinceCatalogMap[since]);
      });
    });

    return catalogsMap;
  }

  private getTotalAccountCatalogMap(accountMap: IAccountMap): IAccountCatalogMapWrapper {
    const map = {};
    let totalMinDate: Date = Date.Today();
    const totalMaxDate: Date = Date.Today();

    Object.values(accountMap).forEach((a) => {
      const minDate: Date = new Date(a.accountCatalogMap.minDate!);
      const maxDate: Date = new Date(a.accountCatalogMap.maxDate!);
      totalMinDate = Date.Min(totalMinDate, minDate);

      for (
        let m: Date = minDate;
        m <= maxDate;
        m = m.addDays(1)
      ) {
        const date: string = m.toString();
        const accountCatalog: IAccountCatalog
          = a.accountCatalogMap.catalogMap[date];

        if (!map[date]) {
          map[date] = 0;
        }

        map[date] += accountCatalog.balance;
      }
    });

    const catalogMap: IAccountCatalogMap = {};

    for (let m: Date = totalMinDate; m <= totalMaxDate; m = m.addDays(1)) {
      const date: string = m.toString();
      const catalog: IAccountCatalog = {
        date,
        etag: null,
        lastModified: null,
        balance: (map[date]) ? map[date] : 0,
      };

      catalogMap[date] = catalog;
    }

    return {
      catalogMap,
      minDate: totalMinDate.toString(),
      maxDate: totalMaxDate.toString(),
    };
  }
}

export default new AssetTools();
