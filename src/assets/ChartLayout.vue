<template>
  <div class="default">
    <ChartAccountTabs
      :asset="asset"
      :assetView="assetView"
    />
    <Chart
      :assetView="assetView"
      :catalogs="this.selectedChartAccount.accountCatalogs"
      :name="this.selectedChartAccount.name"
      :since="this.asset.selectedChartSince"
    />
    <ChartSinceTabs
      :asset="asset"
      :assetView="assetView"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { IAccount, IAccountCatalog, IAsset, IAssetView } from './_interfaces';
import Chart from './Chart.vue';
import ChartAccountTabs from './ChartAccountTabs.vue';
import ChartSinceTabs from './ChartSinceTabs.vue';

@Component({
  components: {
    Chart,
    ChartAccountTabs,
    ChartSinceTabs,
  },
})
export default class ChartLayout extends Vue {
  @Prop() public readonly asset!: IAsset;
  @Prop() public readonly assetView!: IAssetView;
  // data

  // styles

  // computed
  get selectedChartAccount(): IAccount {
    return this.asset.accounts.filter(
      (a) => a.id === this.asset.selectedChartAccountId)[0];
  }

  // methods
}
</script>

<style lang="scss" scoped>
.default {
  min-width: 1100px;
}
</style>
