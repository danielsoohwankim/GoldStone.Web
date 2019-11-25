import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { AxiosResponse } from 'axios';
import HttpStatus from 'http-status-codes';
import _ from 'lodash';
import { assetsConstants, assetsView, Since, Sinces } from './_data';
import { IAccount, IAccountMap, IAsset, IAssetChange, IAssetMap, IAssetsStore, ISelectChartAccount,
  IEditDialogView, ISelectChartSince, ISelectEditItem, ISinceCatalog, ISinceCatalogMap,
  IToggleEditDialog, IToggleExpandAccount, IToggleExpandChart, IAssetsState,
  IUpdateCatalog, IUpdateCatalogRequest } from './_interfaces';
import tools from './_tools';
import goldStoneClient from '@/clients/goldStoneClient';
import { IPutAccountCatalogResponseContractV1 } from '@/clients/IGoldStoneClient';
import { Menus } from '@/layout/_data';
import layoutStore from '@/layout/_store';
import loaderAction from '@/layout/loaderAction';
import store from '@/shared/_store';
import tenantStore from '@/tenant/_store';

@Module({
  namespaced: true,
  name: 'AssetsStore',
  store,
  dynamic: true,
})
class AssetsStore extends VuexModule implements IAssetsStore {
  // initial state
  private initialState: IAssetsState = {
    assetMap: {
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
    },
    editDialogView: {
      assetAccountMap: {
        [assetsView.cash.id]: undefined,
        [assetsView.investment.id]: undefined,
        [assetsView.retirement.id]: undefined,
      },
      assetId: undefined,
      show: false,
    },
    isLoaded: false,
    sinces: [
      Since[Since.Today],
      Since[Since.Yesterday],
      Since[Since.OneWeek],
      Since[Since.TwoWeeks],
    ],
  };
  // lowercase 'state' is reserved in Vuex
  private State: IAssetsState = {
    assetMap: this.initialState.assetMap,
    editDialogView: this.initialState.editDialogView,
    isLoaded: this.initialState.isLoaded,
    sinces: this.initialState.sinces,
  };

  get assetMap(): IAssetMap {
    return this.State.assetMap;
  }

  get editDialogView(): IEditDialogView {
    return this.State.editDialogView;
  }

  get isLoaded(): boolean {
    return this.State.isLoaded;
  }

  get sinces(): string[] {
    return this.State.sinces;
  }

  get minSince(): string {
    return this.State.sinces[this.State.sinces.length - 1];
  }

  @Action
  public clear(): void {
    this.context.commit('Clear');
  }

  @Action({commit: 'ResetEditView'})
  public resetEditView(): void {
    //
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

    layoutStore.toggleLoader(true);

    // update catalogs if since goes beyond selected minSince
    await this.SelectSince(since);

    layoutStore.toggleLoader(false);

    return payload;
  }

  @Action({commit: 'SelectEditItem'})
  public selectEditItem(payload: ISelectEditItem): ISelectEditItem {
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

  @Action({commit: 'ToggleEditDialog'})
  public toggleEditDialog(payload: IToggleEditDialog): IToggleEditDialog {
    return payload;
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
  public async updateCatalog(payload: IUpdateCatalog): Promise<void> {
    const { assetId, accountId, balance, date } = payload;

    const response: AxiosResponse<IPutAccountCatalogResponseContractV1 | string>
      = await loaderAction.sendAsync(() => goldStoneClient.putCatalogAsync({
        accountId,
        date: date.toString(),
        tenantId: tenantStore.id,
        value: balance,
      }));

    if (response.status === HttpStatus.UNAUTHORIZED) {
      await tenantStore.signOut(Menus.Assets.path);
      return;
    } else if (response.status !== HttpStatus.OK) {
      layoutStore.setSnackBar({
        duration: Infinity,
        message: response.data as string,
        show: true,
      });

      return;
    }

    layoutStore.setSnackBar({
      duration: 4000,
      message: 'Success!',
      show: true,
    });

    this.context.commit('UpdateCatalog', {
      ...payload,
      etag: response.headers.etag,
      lastModified: parseInt(response.headers['last-modified'], 10),
      sinces: this.State.sinces,
    });
  }

  @Action
  private async SelectSince(since: string): Promise<void> {
    const minSince: string = this.context.getters.minSince;
    const sinceChanges: string[] = Sinces.getChanges(minSince, since);
    let newAssetMap: IAssetMap;

    // update Sinces to have sinces up to the selectedSince
    this.context.commit('AddSinces', sinceChanges);

    try {
      newAssetMap = await tools.getAssetMapAsync(since);
    } catch (e) {
      this.context.commit('RemoveMinSince');
      tools.handleApiErrorAsync(e);
      return;
    }

    const assetChanges: IAssetChange[] = [];
    // replace the catalogs with the new ones,
    // preserve the settings on each asset
    Object.values(newAssetMap).forEach((newAsset: IAsset) => {
      const accountMapClone: IAccountMap
        = _.cloneDeep(this.State.assetMap[newAsset.id].accountMap);

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
    sinces.forEach((since) => this.State.sinces.push(since));
  }

  @Mutation
  private Clear(): void {
    this.State = this.initialState;
  }

  @Mutation
  private CommitAssetChanges(assetChanges: IAssetChange[]): void {
    assetChanges.forEach((assetChange) => {
      const { assetId, accountMap } = assetChange;

      this.State.assetMap[assetId].accountMap = accountMap;
    });
  }

  @Mutation
  private RemoveMinSince(): void {
    this.State.sinces.pop();
  }

  @Mutation
  private ToggleEditDialog(payload: IToggleEditDialog): void {
    const { assetId, accountId, show } = payload;

    this.State.editDialogView.show = show;

    if (assetId) {
      this.State.editDialogView.assetId = assetId;
      this.State.editDialogView.assetAccountMap[assetId] = accountId;
    }
  }

  @Mutation
  private ResetEditView(): void {
    _.keys(this.State.editDialogView.assetAccountMap)
      .forEach((key) => this.State.editDialogView.assetAccountMap[key] = undefined);
    this.State.editDialogView.assetId = undefined;
  }

  @Mutation
  private SelectChartAccount(payload: ISelectChartAccount): void {
    const { assetId, accountId } = payload;
    const asset: IAsset = this.State.assetMap[assetId];

    asset.selectedChartAccountId = accountId;
  }

  @Mutation
  private SelectChartSince(payload: ISelectChartSince): void {
    const { assetId, since } = payload;
    const asset: IAsset = this.State.assetMap[assetId];

    asset.selectedChartSince = since;
  }

  @Mutation
  private SelectEditItem(payload: ISelectEditItem): void {
    const { type, id } = payload;

    if (type === 'asset') {
      this.State.editDialogView.assetId = id;
    } else if (type === 'account') {
      const assetId: string = this.State.editDialogView.assetId!;
      this.State.editDialogView.assetAccountMap[assetId] = id;
    }
  }

  @Mutation
  private SetAssetMap(assetMap: IAssetMap): void {
    this.State.assetMap = assetMap;
    this.State.isLoaded = true;
  }

  @Mutation
  private ToggleExpandAccount(payload: IToggleExpandAccount): void {
    const { assetId, accountId, expand } = payload;
    const account: IAccount = this.State.assetMap[assetId].accountMap[accountId];

    account.expand = expand;
  }

  @Mutation
  private ToggleExpandChart(payload: IToggleExpandChart): void {
    const { assetId, expand } = payload;
    const asset: IAsset = this.State.assetMap[assetId];

    asset.expandChart = expand;
  }

  @Mutation
  private UpdateCatalog(payload: IUpdateCatalogRequest): void {
    const { assetId, accountId, balance, date, etag, lastModified, sinces }
      = payload;

    this.State.assetMap[assetId]
      .accountMap[accountId]
      .accountCatalogMap
      .catalogMap[date.toString()] = {
        balance,
        date: date.toString(),
        etag,
        lastModified,
      };

    const sinceCatalogMap: ISinceCatalogMap =
      this.State
        .assetMap[assetId]
        .accountMap[accountId]
        .sinceCatalogMap;

    if (date.equals(Sinces.getDate(Since.Today)) === true) {
      const todayValue: number = balance;
      const yesterdayValue: number =
        sinceCatalogMap[Since[Since.Yesterday]].balance;

      sinceCatalogMap[Since[Since.Today]] =
        tools.getTodaySinceCatalog(todayValue, yesterdayValue, lastModified);

      _.values(sinces)
        .filter((since) => since !== Since[Since.Today])
        .forEach((since) => {
          const pastValue: number = (sinceCatalogMap[since])
            ? sinceCatalogMap[since].balance
            : 0;
          const sinceCatalog: ISinceCatalog =
            tools.getPastSinceCatalog(pastValue, todayValue, since);

          sinceCatalogMap[since] = sinceCatalog;
        });
    } else {
      // has a date that matches one of the sinces
      const matchingSinces: string[] =
        _.values(sinces).filter(
          (since) => date.equals(Sinces.getDate(since)));
      const hasMatchingSince: boolean = matchingSinces.length > 0;

      if (hasMatchingSince === true) {
        const since: string = matchingSinces[0];
        const todayValue: number = sinceCatalogMap[Since[Since.Today]].balance;
        const pastValue: number = balance;

        sinceCatalogMap[since] =
          tools.getPastSinceCatalog(pastValue, todayValue, since);
      }
    }
  }
}

export default getModule(AssetsStore);
