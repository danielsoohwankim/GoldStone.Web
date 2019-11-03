<template>
  <div class="default">
    <ChartAccountTabs
      :asset="asset"
      :assetView="assetView"
    />
    <Chart
      :account="this.selectedChartAccount"
      :asset="asset"
      :assetView="assetView"
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
    return this.asset.accountMap[this.asset.selectedChartAccountId!];
  }

  // methods
}
</script>

<style lang="scss" scoped>
.default {
  min-width: 1100px;
}
</style>
