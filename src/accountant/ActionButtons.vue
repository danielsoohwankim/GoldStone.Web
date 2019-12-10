<template>
  <div>
    <div class="padding-top">
      <md-button
        class="md-primary button verify"
        :disabled="canVerify === false"
        @click="verifyAll()"
      >
        Verify All
      </md-button>
      <md-button
        class="md-accent button merge"
        :disabled="canMerge === false"
        @click="merge()"
      >
        Merge
      </md-button>
      <md-button
        class="button unselect"
        :disabled="canUnselect === false"
        @click="unselectAll()"
      >
        Unselect All
      </md-button>
      <!-- todo: remove -->
      <md-button class="md-primary button" @click="toLegacy()">
        To Legacy
      </md-button>
    </div>
    <div class="padding-bottom"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { TransactionType } from './_data';
import accountant, { ITransaction } from './_store';
// todo: remove
import tenant from '@/tenant/_store';

@Component
export default class Actions extends Vue {
  // data

  // computed
  get canMerge(): boolean {
    return accountant.selectedPendingIds.length === 1
      && accountant.selectedTransactionIds.length === 1;
  }

  get canUnselect(): boolean {
    return accountant.selectedPendingIds.length > 0
      || accountant.selectedTransactionIds.length > 0;
  }

  get canVerify(): boolean {
    const transactions: ITransaction[] =
      accountant.getTransactions(TransactionType.Transaction);

    for (const key of Object.keys(transactions)) {
      const transaction: ITransaction = transactions[key];
      if (accountant.isVerified(transaction.id) === false) {
        return true;
      }
    }

    return false;
  }

  // methods
  public merge(): void {
    //
  }

  public unselectAll(): void {
    accountant.unselectAll();
  }

  public verifyAll(): void {
    accountant.verifyAll();
  }

  // todo: remove
  public toLegacy(): void {
    window.open(`https://goldstone.azurewebsites.net/expenses?${tenant.id}`, '_blank');
  }
}
</script>

<style lang="scss" scoped>
.padding-top {
  padding-top: 5px;
}

.padding-bottom{
  clear: right;
  padding-bottom: 5px;
}

.button {
  float: right;
}

.merge {
  margin-right: -3px;
}

.unselect {
  margin-right: 0px;
}

.verify {
  margin-right: 25px;
}
</style>
