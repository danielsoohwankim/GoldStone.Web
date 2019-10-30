import moment from 'moment';
import { assetsConstants, Since, assetsView } from './_data';
import { IAccount, IAccountCatalog, IAccountCatalogMap, IAsset, IAssetTools, IAssetView, ISinceCatalog } from './_interfaces';
import store from './_store';
import {
  GetAssetResponseContractV1,
  GetAssetAccountResponseContractV1,
  GetAssetAccountCatalogResponseContractV1,
 } from '@/clients/IGoldStoneClient';
import { objectTools } from '@/shared/_tools';
import { Date, DATE_FORMAT } from '@/shared/Date';
import { goldStoneException } from '@/shared/GoldStoneException';

class AssetTools implements IAssetTools {
  private sinceCatalogSinces: Since[] = [
    Since.Today,
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

  public createTotalAccount(accounts: IAccount[], assetName: string): IAccount {
    const sinceCatalogsMap = this.getSinceCatalogsMap(accounts);
    // create total catalog
    const sinceCatalogs: ISinceCatalog[] = [];

    this.sinceCatalogSinces.forEach(
      (since) => sinceCatalogs.push(
        this.createTotalSinceCatalog(sinceCatalogsMap[since])));
    // calculate changePercent
    const todayCatalog: ISinceCatalog =
    sinceCatalogs.filter((c) => c.since === Since.Today)[0];
    const todayBalance: number = todayCatalog.balance;
    const yesterdayCatalog: ISinceCatalog =
    sinceCatalogs.filter((c) => c.since === Since.Yesterday)[0];
    const yesterdayBalance: number = (yesterdayCatalog) ? yesterdayCatalog.balance : 0;

    sinceCatalogs.forEach((c) => {
      if (c.since === Since.Today) {
        c.changePercent = this.getChangePercent(todayBalance, yesterdayBalance);
      } else {
        c.changePercent = this.getChangePercent(todayBalance, c.balance);
      }
    });

    return {
      // todo
      accountCatalogMap: this.getTotalAccountCatalogMap(accounts),
      expand: false,
      id: assetsConstants.totalAccountId,
      name: `${assetName} ${assetsConstants.totalName}`,
      sinceCatalogs,
      symbol: assetsConstants.totalSymbol,
    };
  }

  public createTotalAsset(assets: IAsset[]): IAsset {
    const totalAsset: IAsset = {
      accounts: [],
      expandChart: false,
      name: assetsView.assets.name,
      selectedChartAccountId: assetsConstants.totalAccountId,
      selectedChartSince: Since.TwoWeeks,
      title: assetsView.assets.title,
    };

    assets.forEach((asset) => {
      const totalAccount: IAccount =
        this.createTotalAccount(asset.accounts, asset.title);

      asset.accounts.push(totalAccount);

      const totalAccountClone: IAccount = objectTools.clone(totalAccount);
      totalAccountClone.accountCatalogMap.catalogMap
        = new Map(totalAccount.accountCatalogMap.catalogMap);
      totalAccountClone.id = asset.name;
      totalAccountClone.name = asset.title;
      totalAccountClone.symbol = assetsView[asset.name].symbol;
      totalAsset.accounts.push(totalAccountClone);
    });

    // create liquid and total accounts
    const liquidAccount: IAccount =
      this.createLiquidAccount(totalAsset)!;
    const totalTotalAccount: IAccount =
      this.createTotalAccount(totalAsset.accounts, '');
    totalTotalAccount.name = assetsConstants.totalName;

    totalAsset.accounts.push(liquidAccount);
    // reorder total accounts
    const totalAssetAccountOrder: IAssetView[] = [
      assetsView.investment,
      assetsView.cash,
      assetsView.liquid,
      assetsView.retirement,
    ];
    const totalAssetAccountMap = {};
    totalAsset.accounts.forEach((a) => {
      totalAssetAccountMap[a.name] = a;
    });

    const orderedTotalAssetAccounts: IAccount[] = [];
    totalAssetAccountOrder.forEach((a) => {
      const account: IAccount = totalAssetAccountMap[a.title];

      orderedTotalAssetAccounts.push(account);
    });

    totalAsset.accounts = orderedTotalAssetAccounts;
    totalAsset.accounts.push(totalTotalAccount);

    return totalAsset;
  }

  public getAccount(assetName: string, accountId: string): IAccount {
    const asset: IAsset = this.getAsset(assetName);

    return asset.accounts.filter((a: IAccount) => a.id === accountId)[0];
  }

  public getAsset(assetName: string): IAsset {
    return store.assets.filter((a: IAsset) => a.name === assetName)[0];
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
      accountCatalogMap: this.convertToAccountCatalogMap(goldStoneAccount.accountCatalogs),
      expand: false,
      id: goldStoneAccount.accountId,
      isTracked: goldStoneAccount.isTracked,
      name: goldStoneAccount.accountName,
      sinceCatalogs: this.convertToSinceCatalogs(goldStoneAccount.accountCatalogs),
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
  : IAccountCatalogMap {
    goldStoneAccountCatalogs =
      goldStoneAccountCatalogs.filter((accountCatalog) => accountCatalog);

    const catalogMap = new Map<string, IAccountCatalog>();

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
      catalogMap.set(accountCatalog.date, accountCatalog);
    });

    return {
      catalogMap,
      minDate: goldStoneAccountCatalogs[0].date,
      maxDate: goldStoneAccountCatalogs[goldStoneAccountCatalogs.length - 1].date,
    };
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
      if (since === Since.Today) {
        return;
      }

      const date: Date = this.getDate(since);
      const catalog: GetAssetAccountCatalogResponseContractV1 | undefined
        = goldStoneAccountCatalogs.find(
          (ac) => ac.date === date.toString());

      const pastValue: number = (catalog) ? catalog.value : 0;
      const sinceCatalog: ISinceCatalog =
        this.getPastSinceCatalog(pastValue, todayValue, date, since);

      sinceCatalogs.push(sinceCatalog);
    });

    return sinceCatalogs;
  }

  private createLiquidAccount(totalAsset: IAsset): IAccount {
    const liquidAccounts: IAccount[]
      = totalAsset.accounts.filter((a) => a.name !== assetsView.retirement.title);

    const liquidAccount: IAccount =
      this.createTotalAccount(liquidAccounts, 'Liquid');

    liquidAccount.id = assetsView.liquid.name;
    liquidAccount.name = assetsView.liquid.title;
    liquidAccount.symbol = assetsView.liquid.symbol!;

    return liquidAccount;
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
    pastValue: number,
    todayValue: number,
    date: Date,
    since: Since)
  : ISinceCatalog {
    return {
      balance: pastValue,
      changeAmount: this.getChangeAmount(todayValue, pastValue),
      changePercent: this.getChangePercent(todayValue, pastValue),
      date: date.toString(),
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

  private getTotalAccountCatalogMap(accounts: IAccount[]): IAccountCatalogMap {
    const map = {};
    let totalMinDate: Date = Date.Today();
    const totalMaxDate: Date = Date.Today();

    accounts.forEach((a) => {
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
          = a.accountCatalogMap.catalogMap.get(date)!;

        if (!map[date]) {
          map[date] = 0;
        }

        map[date] += accountCatalog.balance;
      }
    });

    const catalogMap = new Map<string, IAccountCatalog>();

    for (let m: Date = totalMinDate; m <= totalMaxDate; m = m.addDays(1)) {
      const date: string = m.toString();
      const catalog: IAccountCatalog = {
        date,
        etag: null,
        lastModified: null,
        balance: (map[date]) ? map[date] : 0,
      };

      catalogMap.set(date, catalog);
    }

    return {
      catalogMap,
      minDate: totalMinDate.toString(),
      maxDate: totalMaxDate.toString(),
    };
  }
}

export default new AssetTools();
