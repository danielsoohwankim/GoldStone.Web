<template>
  <div class="default">
    <md-tabs 
      md-alignment="fixed"
      :md-active-tab="selectedChartSince"
    >
      <template slot="md-tab" slot-scope="{ tab }">
        <ChartSinceTab
          :assetView="assetView"
          :tab="tab" 
        />
      </template>
        <md-tab
          v-for="since in chartSinces"
          :id="since"
          :key="since" 
          :md-label="Sinces.toString(since)"
          @click.prevent="onClick(since)"
        >
        </md-tab>
    </md-tabs> 
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { Since, Sinces } from './_data';
import { IAsset, IAssetTools, IAssetView } from './_interfaces';
import store from './_store';
import tools from './_tools';
import ChartSinceTab from './ChartSinceTab.vue';
import { Theme } from '@/layout/_data';
import layoutStore from '@/layout/_store.ts';

@Component({
  components: {
    ChartSinceTab,
  },
})
export default class ChartSinceTabs extends Vue {
  @Prop() public readonly asset!: IAsset;
  @Prop() public readonly assetView!: IAssetView;
  // data
  public chartSinces = [
    Since[Since.TwoWeeks],
    Since[Since.OneMonth],
    Since[Since.ThreeMonths],
    Since[Since.SixMonths],
    Since[Since.OneYear],
    Since[Since.Custom],
  ];
  public readonly Sinces: Sinces = Sinces;
  public readonly tools: IAssetTools = tools;

  // styles
  get style(): object {
    return {
      backgroundColor: (layoutStore.theme === Theme.Light)
        ? this.assetView.color.light.font
        : this.assetView.color.dark.font,
    };
  }

  // computed
  get selectedChartSince(): string {
    return store.assetMap[this.asset.id].selectedChartSince;
  }

  // methods
  public onClick(since: string): void {
    if (this.asset.selectedChartSince === since) {
      return;
    }

    store.selectChartSince({
      assetName: this.asset.name,
      since,
    });
  }
}
</script>

<style lang="scss" scoped>
.default {
  padding-bottom: 10px;
}
</style>
