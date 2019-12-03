<template>
  <div :style="style">
    <span>
      {{ this.changeString }}
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import AssetConstants from './_constants';
import manager from './_manager';
import layout from '@/layout/_store';

@Component
export default class SinceCatalogChange extends Vue {
  @Prop() public readonly bold!: boolean;
  @Prop() public readonly todayBalance!: number;
  @Prop() public readonly pastBalance!: number;

  // data

  // styles
  get style(): object {
    const color: string =
      (this.changeAmount === 0) ? 'Neutral' :
      (this.changeAmount > 0) ? 'Plus' : 'Minus';
    const style: object = {
      color: AssetConstants.Layout.Color[layout.theme][color],
    };

    return (this.bold === true)
      ? { ...style, fontWeight: 'bold' }
      : style;
  }

  // computed
  get changeAmount(): number {
    return Math.round((this.todayBalance - this.pastBalance) * 100) / 100;
  }

  get changePercent(): number {
    const changePercent: number =
      (this.todayBalance > this.pastBalance)
        ? (this.pastBalance === 0)
          ? 0
          : ((this.todayBalance / this.pastBalance) - 1) * 100
        : (this.todayBalance === 0)
          ? 0
          : ((this.pastBalance / this.todayBalance) - 1) * 100;

    return Math.round((changePercent) * 100) / 100;
  }

  get changeString(): string {
    const sign: string = (this.changeAmount >= 0) ? '+' : '-';
    const amount: string = manager.toCurrencyString(Math.abs(this.changeAmount));
    const percent: string = manager.toCurrencyString(Math.abs(this.changePercent));

    return `${sign}$${amount} (${percent}%)`;
  }

  // methods
}
</script>

<style lang="scss" scoped>
</style>
