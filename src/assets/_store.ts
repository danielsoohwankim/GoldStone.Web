import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { assetsConstants, assetsView, Since } from './_data';
import { IAccount, IAsset, IAssetMap, IAssetsStore } from './_interfaces';
import tools from './_tools';
import store from '@/shared/_store';

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
      selectedChartAccountId: assetsConstants.totalAccountId,
      selectedChartSince: Since[Since.TwoWeeks],
      title: assetsView.assets.title,
    },
    [assetsView.investment.id]: {
      accountMap: {},
      expandChart: false,
      id: assetsView.investment.id,
      name: assetsView.investment.name,
      selectedChartAccountId: assetsConstants.totalAccountId,
      selectedChartSince: Since[Since.TwoWeeks],
      title: assetsView.investment.title,
    },
    [assetsView.cash.id]: {
      accountMap: {},
      expandChart: false,
      id: assetsView.cash.id,
      name: assetsView.cash.name,
      selectedChartAccountId: assetsConstants.totalAccountId,
      selectedChartSince: Since[Since.TwoWeeks],
      title: assetsView.cash.title,
    },
    [assetsView.retirement.id]: {
      accountMap: {},
      expandChart: false,
      id: assetsView.retirement.id,
      name: assetsView.retirement.name,
      selectedChartAccountId: assetsConstants.totalAccountId,
      selectedChartSince: Since[Since.TwoWeeks],
      title: assetsView.retirement.title,
    },
  };
  private Sinces: string[] = [
    Since[Since.Today],
    Since[Since.Yesterday],
    Since[Since.OneWeek],
    Since[Since.TwoWeeks],
  ];

  get assetMap(): IAssetMap {
    return this.AssetMap;
  }

  get sinces(): string[] {
    return this.Sinces;
  }

  get maxSince(): string {
    return this.Sinces[this.Sinces.length - 1];
  }

  @Action({commit: 'SelectChartAccount'})
  public selectChartAccount(payload: object): any {
    return payload;
  }

  @Action({commit: 'SelectChartSince'})
  public selectChartSince(payload: object): any {
    return payload;
  }

  @Action
  public async selectSince(since: string): Promise<any> {
    this.context.commit('SelectSince', since);

    const assetMap: IAssetMap = await tools.getAssetMapAsync(since);

    this.context.commit('UpdateCatalogs', assetMap);
  }

  @Action({commit: 'SetAssetMap'})
  public setAssetMap(assetMap: IAssetMap): IAssetMap {
    return assetMap;
  }

  @Action({commit: 'ToggleExpandAccount'})
  public toggleExpandAccount(payload: object): any {
    return payload;
  }

  @Action({commit: 'ToggleExpandChart'})
  public async toggleExpandChart(payload: object): Promise<any> {
    return payload;
  }
// revisit - name -> id
  @Mutation
  private SelectChartAccount(payload): void {
    const { assetName, accountId } = payload;
    const asset: IAsset = this.AssetMap[assetName];

    asset.selectedChartAccountId = accountId;
  }
// revisit - name -> id
  @Mutation
  private SelectChartSince(payload): void {
    const { assetName, since } = payload;
    const asset: IAsset = this.AssetMap[assetName];

    asset.selectedChartSince = since;
  }

  @Mutation
  private SelectSince(sinceKey: string): void {
    // update Sinces to have sinces up to the selectedSince
    for (
      let since: Since = Since[this.Sinces[this.Sinces.length - 1]] - 1;
      since >= Since[sinceKey];
      since--) {
      this.Sinces.push(Since[since]);
    }
  }

  @Mutation
  private SetAssetMap(assetMap: IAssetMap): void {
    this.AssetMap = assetMap;
  }
// revisit - name -> id
  @Mutation
  private ToggleExpandAccount(payload): void {
    const { assetName, accountId, expand } = payload;
    const account: IAccount = this.AssetMap[assetName].accountMap[accountId];

    account.expand = expand;
  }

  @Mutation
  private ToggleExpandChart(payload): void {
    const { assetName, expandChart } = payload;
    const asset: IAsset = this.AssetMap[assetName];

    asset.expandChart = expandChart;
  }

  @Mutation
  private UpdateCatalogs(assetMap: IAssetMap): void {
    this.AssetMap = assetMap;
  }
}

export default getModule(AssetsStore);
