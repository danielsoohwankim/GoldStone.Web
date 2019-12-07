<template>
  <div
    class="save"
   :style="divStyle"
   @click="saveAsync"
  >
    <md-icon class="md-accent">
      save
      <md-tooltip
        md-direction="right"
        :md-delay="delay"
      >Save
      </md-tooltip>
    </md-icon>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import accountant from './_store';
import SharedConstants from '@/shared/_constants';

@Component
export default class EditSave extends Vue {
  @Prop() public readonly transactionId!: string;
  @Prop() public readonly divStyle!: string;
  // data
  public readonly delay = SharedConstants.Tooltip.Delay;

  // styles

  // computed

  // methods
  public async saveAsync(): Promise<void> {
    await accountant.saveFloatingTransactionAsync(this.transactionId);
  }
}
</script>

<style lang="scss" scoped>
  .save {
    cursor: pointer;
  }
</style>
