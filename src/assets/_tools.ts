import moment from 'moment';
import { assetsConstants, Since, assetsView } from './_data';
import { IAccount, IAccountCatalog, IAsset, IAssetTools, ISinceCatalog } from './_interfaces';
import store from './_store';
import {
  GetAssetResponseContractV1,
  GetAssetAccountResponseContractV1,
  GetAssetAccountCatalogResponseContractV1,
 } from '@/clients/IGoldStoneClient';
import { Date } from '@/shared/Date';
import { goldStoneException } from '@/shared/GoldStoneException';

class AssetTools implements IAssetTools {
  private sinceCatalogSinces: Since[] = [
    Since.Yesterday,
    Since.OneWeek,
    Since.OneMonth,
    Since.ThreeMonths,
    Since.SixMonths,
    Since.OneYear,
  ];

  public convertToAssets(goldStoneAssets: GetAssetResponseContractV1[]): IAsset[] {
    return goldStoneAssets
            .filter((asset) => asset) // defined
            .map((asset) => this.convertToAsset(asset));
  }

  public createLiquidAccount(totalAsset: IAsset): IAccount {
    const liquidAccounts: IAccount[]
      = totalAsset.accounts.filter((a) => a.name !== assetsView.retirement.title);

    const liquidAccount: IAccount =
      this.createTotalAccount(liquidAccounts);

    liquidAccount.id = assetsView.liquid.name;
    liquidAccount.name = assetsView.liquid.title;
    liquidAccount.symbol = assetsView.liquid.symbol!;

    return liquidAccount;
  }

  public createTotalAccount(accounts: IAccount[]): IAccount {
    // calculate intersection of all sinces in the accounts
    const sinceArrays: Since[][]
      = accounts.map((a) => a.sinceCatalogs.map((ac) => ac.since));
    const sinceIntersection: Since[]
      = sinceArrays.reduce((a, b) => a.filter((c) => b.includes(c)));
    const sinceCatalogsMap = this.getSinceCatalogsMap(accounts);
    // create total catalog
    const sinceCatalogs: ISinceCatalog[] = [];

    sinceIntersection.forEach(
      (since) => sinceCatalogs.push(
        this.createTotalSinceCatalog(sinceCatalogsMap[since])));
    // calculate changePercent
    const todayCatalog: ISinceCatalog =
    sinceCatalogs.filter((c) => c.since === Since.Today)[0];
    const todayBalance: number = todayCatalog.balance;
    const yesterdayCatalog: ISinceCatalog =
    sinceCatalogs.filter((c) => c.since === Since.Yesterday)[0];
    const yesterdayBalance: number = yesterdayCatalog.balance;

    sinceCatalogs.forEach((c) => {
      if (c.since === Since.Today) {
        c.changePercent = this.getChangePercent(todayBalance, yesterdayBalance);
      } else {
        c.changePercent = this.getChangePercent(todayBalance, c.balance);
      }
    });

    return {
      // todo
      accountCatalogs: [],
      expand: false,
      id: assetsConstants.totalAccountId,
      name: '', // total doesn't display any names
      sinceCatalogs,
      symbol: assetsConstants.totalSymbol,
    };
  }

  public createTotalAsset(): IAsset {
    return {
      accounts: [],
      expandChart: false,
      name: assetsView.assets.name,
      selectedChartAccountId: assetsConstants.totalAccountId,
      selectedChartSince: Since.TwoWeeks,
      title: assetsView.assets.title,
    };
  }

  public getAsset(assetName: string): IAsset {
    return store.assets.filter((a: IAsset) => a.name === assetName)[0];
  }

  public getAccount(assetName: string, accountId: string): IAccount {
    const asset: IAsset = this.getAsset(assetName);

    return asset.accounts.filter((a: IAccount) => a.id === accountId)[0];
  }

  public getDate(since: Since): Date {
    const today: Date = Date.Today();

    switch (since) {
      case Since.Today: return today;
      case Since.Yesterday: return today.addDays(-1);
      case Since.OneWeek: return today.addWeeks(-1);
      case Since.TwoWeeks: return today.addWeeks(-2);
      case Since.OneMonth: return today.addMonths(-1);
      case Since.ThreeMonths: return today.addMonths(-3);
      case Since.SixMonths: return today.addMonths(-6);
      case Since.OneYear: return today.addYears(-1);
    }

    throw new goldStoneException(`invalid since type ${since}`);
  }

  public toCurrencyString(num: number): string {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  public toggleExpandChart(asset: IAsset): void {
    store.toggleExpandChart({
      assetName: asset.name,
      expandChart: !asset.expandChart,
    });
  }

  private convertToAsset(goldStoneAsset: GetAssetResponseContractV1): IAsset {
    return {
      accounts: this.convertToAccounts(goldStoneAsset.accounts),
      expandChart: false,
      name: goldStoneAsset.assetType.toLowerCase(),
      selectedChartAccountId: assetsConstants.totalAccountId,
      selectedChartSince: Since.TwoWeeks,
      title: goldStoneAsset.assetType,
    };
  }

  private convertToAccounts(goldStoneAccounts: GetAssetAccountResponseContractV1[]): IAccount[] {
    const accounts: IAccount[] =
      goldStoneAccounts
        .filter((account) => account) // defined
        .map((account) => this.convertToAccount(account));

    return accounts.sort(
      (a, b) => b.sinceCatalogs[0].balance - a.sinceCatalogs[0].balance);
  }

  private convertToAccount(goldStoneAccount: GetAssetAccountResponseContractV1): IAccount {
    return {
      accountCatalogs: this.convertToAccountCatalogs(goldStoneAccount.accountCatalogs),
      expand: false,
      id: goldStoneAccount.accountId,
      name: goldStoneAccount.accountName,
      sinceCatalogs: this.convertToSinceCatalogs(goldStoneAccount.accountCatalogs),
      symbol: goldStoneAccount.accountSymbol,
    };
  }

  private convertToAccountCatalog(goldStoneAccountCatalog: GetAssetAccountCatalogResponseContractV1)
  : IAccountCatalog {
    return {
      date: moment(goldStoneAccountCatalog.date),
      etag: goldStoneAccountCatalog.etag,
      lastModified: goldStoneAccountCatalog.lastModified,
      balance: goldStoneAccountCatalog.value,
    };
  }

  private convertToAccountCatalogs(goldStoneAccountCatalogs: GetAssetAccountCatalogResponseContractV1[])
  : IAccountCatalog[] {
    goldStoneAccountCatalogs =
      goldStoneAccountCatalogs.filter((accountCatalog) => accountCatalog);

    return goldStoneAccountCatalogs.map((ac) => this.convertToAccountCatalog(ac));
  }

  private convertToSinceCatalogs(goldStoneAccountCatalogs: GetAssetAccountCatalogResponseContractV1[])
  : ISinceCatalog[] {
    goldStoneAccountCatalogs =
      goldStoneAccountCatalogs.filter((accountCatalog) => accountCatalog);

    const today: Date = Date.Today();

    const todayCatalog: GetAssetAccountCatalogResponseContractV1 | undefined
      = goldStoneAccountCatalogs.find((ac) => ac.date === today.toString());
    const todayValue: number = (todayCatalog) ? todayCatalog.value : 0;
    const todayLastModified: number | null =
      (todayCatalog) ? todayCatalog.lastModified : null;
    const yesterdayCatalog: GetAssetAccountCatalogResponseContractV1 | undefined
      = goldStoneAccountCatalogs.find((ac) => ac.date === today.addDays(-1).toString());
    const yesterdayValue: number = (yesterdayCatalog) ? yesterdayCatalog.value : 0;

    const sinceCatalogs: ISinceCatalog[] = [];

    sinceCatalogs.push(
      this.getTodaySinceCatalog(
        todayValue,
        yesterdayValue,
        todayLastModified));

    this.sinceCatalogSinces.forEach((since) => {
      const catalog: GetAssetAccountCatalogResponseContractV1 | undefined
        = goldStoneAccountCatalogs.find(
          (ac) => ac.date === this.getDate(since).toString());

      if (!catalog) {
        return;
      }

      const sinceCatalog: ISinceCatalog =
        this.getPastSinceCatalog(catalog, todayValue, since);

      sinceCatalogs.push(sinceCatalog);
    });

    return sinceCatalogs;
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

  private getPastSinceCatalog(
    goldStoneAccountCatalog: GetAssetAccountCatalogResponseContractV1,
    todayValue: number,
    since: Since)
  : ISinceCatalog {
    return {
      balance: goldStoneAccountCatalog.value,
      changeAmount: this.getChangeAmount(todayValue, goldStoneAccountCatalog.value),
      changePercent: this.getChangePercent(todayValue, goldStoneAccountCatalog.value),
      date: goldStoneAccountCatalog.date,
      since,
    };
  }

  private getSinceCatalogsMap(accounts: IAccount[]) {
    const map = {};
    accounts.forEach((a) =>
      a.sinceCatalogs.forEach((ac) => {
        if (!map[ac.since]) {
          map[ac.since] = [];
        }

        map[ac.since].push(ac);
      }));
    return map;
  }

  private getTodaySinceCatalog(
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
      since: Since.Today,
    };
  }
}

export default new AssetTools();
