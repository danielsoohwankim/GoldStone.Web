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
import assets from './_store';
import { Theme } from '@/layout/_data';
import layoutStore from '@/layout/_store';

@Component({
  components: {
    GChart,
  },
})
export default class Chart extends Vue {
  @Prop() public readonly assetType;

  // data
  private gchart;
  private google;

  // styles

  // computed
  get selectedChartId() {
    return assets.getSelectedChartId(this.assetType);
  }

  get selectedChartSince() {
    return assets.getSelectedChartSince(this.assetType);
  }

  get theme() {
    return layoutStore.theme;
  }

  // watch
  @Watch('selectedChartId')
  public onSelectedChartIdChange(val: string, oldVal: string) {
    chart.drawChart(this.assetType, this.gchart, this.google);
  }
  @Watch('selectedChartSince')
  public onSelectedChartSince(val: Since, oldVal: Since) {
    chart.drawChart(this.assetType, this.gchart, this.google);
  }
  @Watch('theme')
  public onThemeChanged(val: Theme, oldVal: Theme) {
    chart.drawChart(this.assetType, this.gchart, this.google);
  }

  // methods
  public onChartReady(gchart, google) {
    this.gchart = gchart;
    this.google = google;

    chart.drawChart(this.assetType, this.gchart, this.google);
  }
}
</script>

<style lang="scss" scoped>
</style>
