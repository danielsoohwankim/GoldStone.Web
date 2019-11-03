import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { assetsConstants, assetsView, Since } from './_data';
import { IAccount, IAsset, IAssetsStore } from './_interfaces';
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
  private Assets: IAsset[] = [
    {
      accountMap: {},
      expandChart: false,
      name: assetsView.assets.name,
      selectedChartAccountId: assetsConstants.totalAccountId,
      selectedChartSince: Since[Since.TwoWeeks],
      title: assetsView.assets.title,
    },
    {
      accountMap: {},
      expandChart: false,
      name: assetsView.investment.name,
      selectedChartAccountId: assetsConstants.totalAccountId,
      selectedChartSince: Since[Since.TwoWeeks],
      title: assetsView.investment.title,
    },
    {
      accountMap: {},
      expandChart: false,
      name: assetsView.cash.name,
      selectedChartAccountId: assetsConstants.totalAccountId,
      selectedChartSince: Since[Since.TwoWeeks],
      title: assetsView.cash.title,
    },
    {
      accountMap: {},
      expandChart: false,
      name: assetsView.retirement.name,
      selectedChartAccountId: assetsConstants.totalAccountId,
      selectedChartSince: Since[Since.TwoWeeks],
      title: assetsView.retirement.title,
    },
  ];
  private Sinces: string[] = [
    Since[Since.Today],
    Since[Since.Yesterday],
    Since[Since.OneWeek],
    Since[Since.TwoWeeks],
  ];

  get assets(): IAsset[] {
    return this.Assets;
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

    const assets: IAsset[] = await tools.getAssets(since);

    this.context.commit('UpdateCatalogs', assets);
  }

  @Action({commit: 'SetAssets'})
  public setAssets(assets: IAsset[]): any {
    return assets;
  }

  @Action({commit: 'ToggleExpandAccount'})
  public toggleExpandAccount(payload: object): any {
    return payload;
  }

  @Action({commit: 'ToggleExpandChart'})
  public async toggleExpandChart(payload: object): Promise<any> {
    return payload;
  }

  @Mutation
  private SelectChartAccount(payload): void {
    const { assetName, accountId } = payload;
    const asset: IAsset = tools.getAsset(assetName);

    asset.selectedChartAccountId = accountId;
  }

  @Mutation
  private SelectChartSince(payload): void {
    const { assetName, since } = payload;
    const asset: IAsset = tools.getAsset(assetName);

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
  private SetAssets(assets: IAsset[]): void {
    this.Assets = assets;
  }

  @Mutation
  private ToggleExpandAccount(payload): void {
    const { assetName, accountId, expand } = payload;
    const account: IAccount = tools.getAccount(assetName, accountId);

    account.expand = expand;
  }

  @Mutation
  private ToggleExpandChart(payload): void {
    const { assetName, expandChart } = payload;
    const asset: IAsset = tools.getAsset(assetName);

    asset.expandChart = expandChart;
  }

  @Mutation
  private UpdateCatalogs(assets: IAsset[]): void {
    this.Assets = assets;
  }
}

export default getModule(AssetsStore);
