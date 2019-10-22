<template>
  <span class="default" :style="style">{{ tab.label }}</span>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { IAssetView } from './_interfaces';
import { Theme } from '@/layout/_data';
import layoutStore from '@/layout/_store.ts';

@Component
export default class ChartAccountTab extends Vue {
  @Prop() public readonly assetView!: IAssetView;
  @Prop() public readonly tab!: any;
  // data

  // styles
  get style(): object {
    return {
      color: (layoutStore.theme === Theme.Light)
        ? this.assetView.color.light.font
        : this.assetView.color.dark.font,
    };
  }

  // computed

  // methods
}
</script>

<style lang="scss" scoped>
.default {
  text-transform: none;
  font-size: 14px;
}
</style>
