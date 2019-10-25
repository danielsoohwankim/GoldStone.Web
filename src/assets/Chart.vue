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
import drawChart from './_chart';
import { Since } from './_data';
import { IAccountCatalog, IAsset, IAssetView, IChartSettings } from './_interfaces';
import store from './_store';

@Component({
  components: {
    GChart,
  },
})
export default class Chart extends Vue {
  @Prop() public readonly assetView!: IAssetView;
  @Prop() public readonly catalogs!: IAccountCatalog[];
  @Prop() public readonly name!: string;
  @Prop() public readonly since!: Since;

  // data

  // styles

  // computed

  // methods
  public onChartReady(chart, google) {
    const asset: IAsset = store.assets.filter(
      (a) => a.name === this.assetView.name)[0];
    asset.googleChart = chart;
    asset.google = google;
    const settings: IChartSettings = {
      assetView: this.assetView,
      // todo, replace title: with asset
      title: `${this.name} - ${this.since}`,
    };

    drawChart(chart, google, this.catalogs, settings);
  }

  private setAnnotations(data, numDataPoints) {
    const numRows = data.getNumberOfRows();
    const valIndex = 1;
    const annotIndex = 2;

    for (let i = 0; i < numDataPoints - 1; i++) {
      const rowIndex = Math.floor(numRows * (i / (numDataPoints - 1)));
      const val = data.getValue(rowIndex, valIndex);

      data.setValue(rowIndex, annotIndex, val);
    }
    // last row
    const lastIndex = numRows - 1;
    const lastVal = data.getValue(lastIndex, valIndex);
    data.setValue(lastIndex, annotIndex, lastVal);
  }
}
</script>

<style lang="scss" scoped>
</style>
