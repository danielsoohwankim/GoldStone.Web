<template>
  <div>
    <div v-for="assetView in assetViews" :key="assetView.name">
      <Asset 
        :asset="tools.getAsset(assetView.name)"
        :assetView="assetView"
        :expanded="assetView.expanded"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { assetsConstants, assetsView } from './_data';
import { IAccount, IAsset, IAssetTools, IAssetView, IAssetsStore } from './_interfaces';
import store from './_store';
import tools from './_tools';
import Asset from './Asset.vue';
import client from '@/clients/goldStoneClient';
import { GetAssetsResponseContractV1 } from '@/clients/IGoldStoneClient';
import { Date, IDate } from '@/shared/Date';
import { objectTools } from '@/shared/_tools';

// todo: remove
import testData from './testData.js';

@Component({
  components: {
    Asset,
  },
})
export default class Assets extends Vue {
  // properties

  // data
  public assetViews: IAssetView[] = [
    assetsView.assets,
    assetsView.investment,
    assetsView.cash,
    assetsView.retirement,
  ];

  public readonly tools: IAssetTools = tools;
  public readonly store: IAssetsStore = store;

  // styles

  // lifecycle
  public async created() {
    // const endDate: Date = Date.Today();
    // const startDate: Date = endDate.addDays(assetsConstants.startDateOffset);
    // const userId: string = await client.getAdminUserId() as string;
    // const response: GetAssetsResponseContractV1
    //   = ((await client.getAssets(userId, startDate, endDate)) as unknown) as GetAssetsResponseContractV1;

    const response: GetAssetsResponseContractV1 = (testData as unknown) as GetAssetsResponseContractV1;
    const assets: IAsset[] = tools.convertToAssets(response.assets);
    const totalAsset: IAsset = tools.createTotalAsset();

    assets.forEach((asset) => {
      const totalAccount: IAccount =
        tools.createTotalAccount(asset.accounts);
      asset.accounts.push(totalAccount);

      const totalAccountClone: IAccount = objectTools.clone(totalAccount);
      totalAccountClone.id = asset.name;
      totalAccountClone.name = asset.title;
      totalAccountClone.symbol = assetsView[asset.name].symbol;
      totalAsset.accounts.push(totalAccountClone);
    });

    const liquidAccount: IAccount =
      tools.createLiquidAccount(totalAsset)!;
    const totalTotalAccount: IAccount =
      tools.createTotalAccount(totalAsset.accounts);
    totalTotalAccount.name = assetsConstants.totalName;

    totalAsset.accounts.push(liquidAccount);

    const totalAssetAccountOrder: IAssetView[] = [
      assetsView.investment,
      assetsView.cash,
      assetsView.liquid,
      assetsView.retirement,
    ];
    const orderedTotalAssetAccounts: IAccount[] = [];
    totalAssetAccountOrder.forEach((a) => {
      const account: IAccount =
        totalAsset.accounts.filter((ac) => ac.name === a.title)[0];
      orderedTotalAssetAccounts.push(account);
    });

    totalAsset.accounts = orderedTotalAssetAccounts;
    totalAsset.accounts.push(totalTotalAccount);

    assets.push(totalAsset);
    store.setAssets(assets);
  }

  // computed

  // methods
}
</script>

<style lang="scss" scoped>
</style>
