import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import drawChart from './_chart';
import { assetsConstants, assetsView, Since } from './_data';
import { IAccount, IAsset, IAssetsStore, IChartSettings } from './_interfaces';
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
      accounts: [],
      expandChart: false,
      name: assetsView.assets.name,
      selectedChartAccountId: assetsConstants.totalAccountId,
      selectedChartSince: Since.TwoWeeks,
      title: assetsView.assets.title,
    },
    {
      accounts: [],
      expandChart: false,
      name: assetsView.investment.name,
      selectedChartAccountId: assetsConstants.totalAccountId,
      selectedChartSince: Since.TwoWeeks,
      title: assetsView.investment.title,
    },
    {
      accounts: [],
      expandChart: false,
      name: assetsView.cash.name,
      selectedChartAccountId: assetsConstants.totalAccountId,
      selectedChartSince: Since.TwoWeeks,
      title: assetsView.cash.title,
    },
    {
      accounts: [],
      expandChart: false,
      name: assetsView.retirement.name,
      selectedChartAccountId: assetsConstants.totalAccountId,
      selectedChartSince: Since.TwoWeeks,
      title: assetsView.retirement.title,
    },
  ];

  get assets(): IAsset[] {
    return this.Assets;
  }

  @Action({commit: 'SelectChartAccount'})
  public selectChartAccount(payload: object): any {
    return payload;
  }

  @Action({commit: 'SelectChartSince'})
  public selectChartSince(payload: object): any {
    return payload;
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
  public toggleExpandChart(payload: object): any {
    return payload;
  }

  @Mutation
  private SelectChartAccount(payload): void {
    const { assetName, accountId } = payload;
    const asset: IAsset = tools.getAsset(assetName);
    const account: IAccount = tools.getAccount(asset.name, accountId);
    const settings: IChartSettings = {
      assetView: assetsView[assetName],
      title: `${account.name} - ${asset.selectedChartSince}`,
    };

    drawChart(
      asset.googleChart,
      asset.google,
      account.accountCatalogs,
      settings);

    asset.selectedChartAccountId = accountId;
  }

  @Mutation
  private SelectChartSince(payload): void {
    const { assetName, since } = payload;
    const asset: IAsset = tools.getAsset(assetName);

    asset.selectedChartSince = since;
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
}

export default getModule(AssetsStore);
