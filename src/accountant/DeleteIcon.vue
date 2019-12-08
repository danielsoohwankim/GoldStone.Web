<template>
  <div
    class="delete"
    @click="deleteTransaction()"
  >
    <md-icon class="md-accent">
      delete
      <md-tooltip
        md-direction="right"
        :md-delay="delay"
      >Delete
      </md-tooltip>
    </md-icon>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import manager from './_manager';
import accountant, { ITransaction } from './_store';
import SharedConstants from '@/shared/_constants';

@Component
export default class DeleteIcon extends Vue {
  @Prop() public readonly transactionId!: string;
  // data
  public readonly delay = SharedConstants.Tooltip.Delay;

  // styles

  // computed

  // methods
  public async deleteTransaction(): Promise<void> {
    await accountant.deleteTransactionAsync(this.transactionId);
  }
}
</script>

<style lang="scss" scoped>
  .delete {
    cursor: pointer;
  }
</style>