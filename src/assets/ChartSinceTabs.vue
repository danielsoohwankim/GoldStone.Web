<template>
  <div class="default">
    <md-tabs 
      md-alignment="fixed"
      :md-active-tab="tools.getAsset(asset.name).selectedChartSince"
    >
      <template slot="md-tab" slot-scope="{ tab }">
        <ChartSinceTab
          :assetView="assetView"
          :tab="tab" 
        />
      </template>
      <div v-for="since in sinces" :key="since">
        <md-tab
          :id="since"
          :md-label="since"
          @click.prevent="onClick(since)"
        >
        </md-tab>
      </div>
    </md-tabs> 
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { Since } from './_data';
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
  public sinces = [
    Since.TwoWeeks,
    Since.OneMonth,
    Since.ThreeMonths,
    Since.SixMonths,
    Since.OneYear,
    Since.Custom,
  ];
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

  // methods
  public onClick(since): void {
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
