<template>
  <div>
    <GChart
      type="LineChart"
      :data="chartData"
      :options="options"
    />
  </div>
</template>

<script lang="ts">
import { GChart } from 'vue-google-charts';
import { Vue, Prop, Component } from 'vue-property-decorator';
import { Since } from './_data';
import { IAccountCatalog, IAssetView } from './_interfaces';

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
  get chartData(): [[string, string | number]] {
    const data: [[string, string | number]] = [
      ['Date', 'Balance'],
    ];

    const rows = this.catalogs.forEach((c) => data.push([
      c.date.format('MM-DD'),
      c.balance,
    ]));

    return data;
  }

  get options(): object {
    return {
      title: `${this.name} - ${this.since}`,
      backgroundColor: '#424242',
    };
  }

  // methods
}
</script>

<style lang="scss" scoped>
</style>
