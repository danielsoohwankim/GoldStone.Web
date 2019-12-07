<template>
  <div v-if="isLoaded === true">
    <TransactionTable :type="TransactionType.Transaction" />
    <TransactionTable :type="TransactionType.Pending" />
    <EditPending />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { TransactionType } from './_data';
import accountant from './_store';
import EditPending from './EditPending.vue';
import TransactionTable from './TransactionTable.vue';
import Test from './Test.vue';

@Component({
  components: {
    EditPending,
    TransactionTable,
  },
})
export default class Accountant extends Vue {
  // data
  public accountant = accountant;
  public TransactionType = TransactionType;

  // lifecycle
  public async mounted(): Promise<void> {
    // navigating back to Assets menu triggers mounted again (e.g. Dashboard -> Assets)
    if (this.isLoaded === true) {
      return;
    }

    await accountant.initAsync();
  }

  // computed
  get isLoaded(): boolean {
    return accountant.transactions.length > 0;
  }
}
</script>
