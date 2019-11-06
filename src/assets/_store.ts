import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import _ from 'lodash';
import { assetsConstants, assetsView, Since, Sinces } from './_data';
import { IAccount, IAccountMap, IAsset, IAssetChange, IAssetMap, IAssetsStore, ISelectChartAccount,
  ISelectChartSince, IToggleExpandAccount, IToggleExpandChart } from './_interfaces';
import tools from './_tools';
import store from '@/shared/_store';
import { IUser } from '@/user/_interfaces';
import userStore from '@/user/_store';

@Module({
  namespaced: true,
  name: 'AssetsStore',
  store,
  dynamic: true,
})
class AssetsStore extends VuexModule implements IAssetsStore {
  // initial state
  private AssetMap: IAssetMap = {
    [assetsView.assets.id]: {
      accountMap: {},
      expandChart: false,
      id: assetsView.assets.id,
      name: assetsView.assets.name,
      selectedChartAccountId: assetsConstants.totalId,
      selectedChartSince: Since[Since.TwoWeeks],
      title: assetsView.assets.title,
    },
    [assetsView.investment.id]: {
      accountMap: {},
      expandChart: false,
      id: assetsView.investment.id,
      name: assetsView.investment.name,
      selectedChartAccountId: assetsConstants.totalId,
      selectedChartSince: Since[Since.TwoWeeks],
      title: assetsView.investment.title,
    },
    [assetsView.cash.id]: {
      accountMap: {},
      expandChart: false,
      id: assetsView.cash.id,
      name: assetsView.cash.name,
      selectedChartAccountId: assetsConstants.totalId,
      selectedChartSince: Since[Since.TwoWeeks],
      title: assetsView.cash.title,
    },
    [assetsView.retirement.id]: {
      accountMap: {},
      expandChart: false,
      id: assetsView.retirement.id,
      name: assetsView.retirement.name,
      selectedChartAccountId: assetsConstants.totalId,
      selectedChartSince: Since[Since.TwoWeeks],
      title: assetsView.retirement.title,
    },
  };
  private IsLoaded: boolean = false;
  private Sinces: string[] = [
    Since[Since.Today],
    Since[Since.Yesterday],
    Since[Since.OneWeek],
    Since[Since.TwoWeeks],
  ];

  get assetMap(): IAssetMap {
    return this.AssetMap;
  }

  get isLoaded(): boolean {
    return this.IsLoaded;
  }

  get sinces(): string[] {
    return this.Sinces;
  }

  get minSince(): string {
    return this.Sinces[this.Sinces.length - 1];
  }

  @Action({commit: 'SelectChartAccount'})
  public selectChartAccount(payload: ISelectChartAccount): ISelectChartAccount {
    return payload;
  }

  @Action({commit: 'SelectChartSince'})
  public async selectChartSince(payload: ISelectChartSince): Promise<ISelectChartSince> {
    const { since } = payload;
    const minSince: string = this.context.getters.minSince;

    if (Since[since] >= Since[minSince]) {
      return payload;
    }
    // update catalogs if since goes beyond selected minSince
    await this.SelectSince(since);

    return payload;
  }

  // @Action({ rawError: true })
  @Action
  public async selectSince(since: string): Promise<void> {
    await this.SelectSince(since);
  }

  @Action({commit: 'SetAssetMap'})
  public setAssetMap(assetMap: IAssetMap): IAssetMap {
    return assetMap;
  }

  @Action({commit: 'ToggleExpandAccount'})
  public toggleExpandAccount(payload: IToggleExpandAccount): IToggleExpandAccount {
    return payload;
  }

  @Action({commit: 'ToggleExpandChart'})
  public toggleExpandChart(payload: IToggleExpandChart): IToggleExpandChart {
    return payload;
  }

  @Action
  private async SelectSince(since: string): Promise<void> {
    const minSince: string = this.context.getters.minSince;
    const sinceChanges: string[] = Sinces.getChanges(minSince, since);
    // update Sinces to have sinces up to the selectedSince
    this.context.commit('AddSinces', sinceChanges);

    const user: IUser = userStore.user;
    const newAssetMap: IAssetMap = await tools.getAssetMapAsync(user.id, since);
    const assetChanges: IAssetChange[] = [];
    // replace the catalogs with the new ones,
    // preserve the settings on each asset
    Object.values(newAssetMap).forEach((newAsset: IAsset) => {
      const accountMapClone: IAccountMap
        = _.cloneDeep(this.AssetMap[newAsset.id].accountMap);

      Object.values(newAsset.accountMap).forEach((newAccount: IAccount) => {
        if (accountMapClone[newAccount.id]) {
          accountMapClone[newAccount.id].accountCatalogMap = newAccount.accountCatalogMap;
          accountMapClone[newAccount.id].sinceCatalogMap = newAccount.sinceCatalogMap;
        } else {
          accountMapClone[newAccount.id] = newAccount;
        }
      });

      const assetChange: IAssetChange = {
        accountMap: accountMapClone,
        assetId: newAsset.id,
      };

      assetChanges.push(assetChange);
    });

    this.context.commit('CommitAssetChanges', assetChanges);
  }

  @Mutation
  private AddSinces(sinces: string[]): void {
    sinces.forEach((since) => this.Sinces.push(since));
  }

  @Mutation
  private CommitAssetChanges(assetChanges: IAssetChange[]): void {
    assetChanges.forEach((assetChange) => {
      const { assetId, accountMap } = assetChange;

      this.AssetMap[assetId].accountMap = accountMap;
    });
  }

  @Mutation
  private SelectChartAccount(payload: ISelectChartAccount): void {
    const { assetId, accountId } = payload;
    const asset: IAsset = this.AssetMap[assetId];

    asset.selectedChartAccountId = accountId;
  }

  @Mutation
  private SelectChartSince(payload: ISelectChartSince): void {
    const { assetId, since } = payload;
    const asset: IAsset = this.AssetMap[assetId];

    asset.selectedChartSince = since;
  }

  @Mutation
  private SetAssetMap(assetMap: IAssetMap): void {
    this.AssetMap = assetMap;
    this.IsLoaded = true;
  }

  @Mutation
  private ToggleExpandAccount(payload: IToggleExpandAccount): void {
    const { assetId, accountId, expand } = payload;
    const account: IAccount = this.AssetMap[assetId].accountMap[accountId];

    account.expand = expand;
  }

  @Mutation
  private ToggleExpandChart(payload: IToggleExpandChart): void {
    const { assetId, expand } = payload;
    const asset: IAsset = this.AssetMap[assetId];

    asset.expandChart = expand;
  }
}

export default getModule(AssetsStore);
