<template>
  <div 
    class="reset"
    @click="click"
  >
    <md-icon class="md-primary">
      refresh
      <md-tooltip
        md-direction="right"
        :md-delay="delay"
      >Reset
      </md-tooltip>
    </md-icon>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import accountant from './_store';
import SharedConstants from '@/shared/_constants';

@Component
export default class EditReset extends Vue {
  @Prop() public readonly transactionId!: string;
  // data
  public readonly delay = SharedConstants.Tooltip.Delay;

  // styles

  // computed

  // methods
  public click(): void {
    accountant.resetFloatingTransaction(this.transactionId);
  }
}
</script>

<style lang="scss" scoped>
  .reset {
    cursor: pointer;
  }
</style>