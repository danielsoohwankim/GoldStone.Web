<template>
  <div>
    <GChart
      type="LineChart"
      version="45.2"
      :data="null"
      @ready="onChartReady"
    />
  </div>
</template>

<script lang="ts">
import { GChart } from 'vue-google-charts';
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import chart from './_chart';
import { Since } from './_data';
import { IAccount, IAsset, IAssetView } from './_interfaces';
import store from './_store';
import { Theme } from '@/layout/_data';
import layoutStore from '@/layout/_store';

@Component({
  components: {
    GChart,
  },
})
export default class Chart extends Vue {
  @Prop() public readonly account!: IAccount;
  @Prop() public readonly asset!: IAsset;
  @Prop() public readonly assetView!: IAssetView;
  @Watch('selectedChartAccountId')
  public onSelectedChartAccountIdChange(val: string, oldVal: string) {
    this.drawChart();
  }
  @Watch('selectedChartSince')
  public onSelectedChartSince(val: Since, oldVal: Since) {
    this.drawChart();
  }
  @Watch('theme')
  public onThemeChanged(val: Theme, oldVal: Theme) {
    this.drawChart();
  }

  // data

  // styles

  // computed
  get selectedChartAccountId() {
    return this.asset.selectedChartAccountId;
  }

  get selectedChartSince() {
    return this.asset.selectedChartSince;
  }

  get theme() {
    return layoutStore.theme;
  }

  // methods
  public onChartReady(gchart, google) {
    this.asset.googleChart = gchart;
    this.asset.google = google;

    this.drawChart();
  }

  private drawChart(): void {
    chart.drawChart(this.asset, this.assetView, this.account);
  }
}
</script>

<style lang="scss" scoped>
</style>
