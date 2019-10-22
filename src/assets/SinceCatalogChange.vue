<template>
  <div :style="style">
    <span>
      {{ this.changeString }}
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { assetsView } from './_data';
import { ISinceCatalog, IAssetTools } from './_interfaces';
import tools from './_tools';
import { ILayoutStore } from '@/layout/_interfaces';
import layoutStore from '@/layout/_store';

@Component
export default class SinceCatalogChange extends Vue {
  @Prop() public readonly bold!: boolean;
  @Prop() public readonly catalog!: ISinceCatalog;
  // data
  public readonly layoutStore: ILayoutStore = layoutStore;
  public readonly tools: IAssetTools = tools;

  // styles
  get style(): object {
    const color: string =
      (this.catalog.changeAmount === 0) ? 'neutral' :
      (this.catalog.changeAmount > 0) ? 'plus' : 'minus';

    return (this.bold === true) ? {
      color: assetsView.layout.color[layoutStore.theme][color],
      fontWeight: 'bold',
    } : {
      color: assetsView.layout.color[layoutStore.theme][color],
    };
  }

  // computed
  get changeString(): string {
    const sign: string = (this.catalog.changeAmount >= 0) ? '+' : '-';
    const amount: string = this.tools.toCurrencyString(Math.abs(this.catalog.changeAmount));
    const percent: string = this.tools.toCurrencyString(Math.abs(this.catalog.changePercent));

    return `${sign}$${amount} (${percent}%)`;
  }

  // methods
}
</script>

<style lang="scss" scoped>
</style>
