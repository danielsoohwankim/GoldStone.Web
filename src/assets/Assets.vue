<template>
  <div>
    <SinceSelect
      :selectedSince="store.maxSince"
    />
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
import SinceSelect from './SinceSelect.vue';
import client from '@/clients/goldStoneClient';
import { GetAssetsResponseContractV1 } from '@/clients/IGoldStoneClient';
import { Date, IDate } from '@/shared/Date';

// todo: remove
import testData from './testData.js';

@Component({
  components: {
    Asset,
    SinceSelect,
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
    // const startDate: Date = tools.getDate(store.maxSince);
    // const endDate: Date = Date.Today();
    // const userId: string = await client.getAdminUserId() as string;
    // const response: GetAssetsResponseContractV1
    //   = ((await client.getAssets(userId, startDate, endDate)) as unknown) as GetAssetsResponseContractV1;

    const response: GetAssetsResponseContractV1 = (testData as unknown) as GetAssetsResponseContractV1;
    const assets: IAsset[] = tools.convertToAssets(response.assets);
    const totalAsset: IAsset = tools.createTotalAsset(assets);

    assets.push(totalAsset);
    store.setAssets(assets);
  }

  // computed

  // methods
}
</script>

<style lang="scss" scoped>
</style>
