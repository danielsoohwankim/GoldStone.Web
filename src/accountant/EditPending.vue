<template>
  <div v-if="accountant.showEditPending">
    <md-dialog 
      :md-active="accountant.showEditPending"
      style="width: 90%;"
      :style="manager.getScrollStyle()">
      <md-dialog-title :style="titleStyle">Edit Pending Transactions</md-dialog-title>

      <md-table
        v-model="selectedPendings"
        md-fixed-header
      >
        <md-table-row
          slot="md-table-row" 
          slot-scope="{ item }"
          class="md-primary"
          style="height: 57px;"
        >
          <md-table-cell 
            md-label="Users"
            class="edit-user"
          >
            <md-avatar>
              <img
                :src="accountant.getUserProfileImage(item.accountId)"
                alt="Avatar"
              >
            </md-avatar>
          </md-table-cell>
          <md-table-cell 
            md-label="Symbol"
            md-sort-by="symbol"
            class="edit-symbol"
          >{{ accountant.getAccountSymbol(item.accountId) }}
          </md-table-cell>
          <md-table-cell 
            md-label="Date" 
            md-sort-by="date"
            class="edit-date"
          >{{ item.date }}
          </md-table-cell>
          <md-table-cell 
            md-label="Name" 
            md-sort-by="name"
            class="edit-name"
          >{{ item.name }}
          </md-table-cell>
          <md-table-cell 
            md-label="Amount" 
            md-sort-by="amount"
            class="edit-amount"
            :style="manager.getAmountStyle(item.amount)"
          >{{ sharedManager.getFormattedAmount(item.amount) }}
          </md-table-cell>
          <md-table-cell 
            md-label="Category" 
            md-sort-by="category"
            class="edit-category"
          >
            <ExpenseCategorySelect :transactionId="item.id" />
          </md-table-cell>
          <md-table-cell 
            md-label="Note" 
            md-sort-by="note"
            class="edit-note"
          >
            <EditNote :transactionId="item.id" />
          </md-table-cell>
          <md-table-cell 
            md-label="Actions" 
            class="edit-actions"
          >
            <EditSave :transactionId="item.id" divStyle="float: right;" />
            <EditReset :transactionId="item.id" />
          </md-table-cell>
        </md-table-row>
      </md-table>

      <md-dialog-actions>
        <md-button @click="accountant.toggleEditPending(false)">Close</md-button>
        <md-button
          class="md-primary"
          :disabled="isChanged === false"
          @click="accountant.resetSelectedTransactions(transactionType)"
        >Reset All
        </md-button>
        <md-button
          class="md-accent"
          :disabled="isChanged === false"
          @click="accountant.saveSelectedTransactionsAsync(transactionType)"
        >Save All</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import { TransactionType } from './_data';
import manager from './_manager';
import accountant, { ITransaction } from './_store';
import EditNote from './EditNote.vue';
import EditReset from './EditReset.vue';
import EditSave from './EditSave.vue';
import ExpenseCategorySelect from './ExpenseCategorySelect.vue';
import LayoutConstants from '@/layout/_constants';
import layout from '@/layout/_store';
import SharedConstants from '@/shared/_constants';
import sharedManager from '@/shared/_manager';

@Component({
  components: {
    EditNote,
    EditReset,
    EditSave,
    ExpenseCategorySelect,
  },
})
export default class EditPending extends Vue {
  // data
  public readonly accountant = accountant;
  public readonly delay = SharedConstants.Tooltip.Delay;
  public readonly manager = manager;
  public readonly sharedManager = sharedManager;
  public readonly transactionType = TransactionType.Pending;

  // styles
  get titleStyle(): object {
    return {
      color: LayoutConstants.Layout.Colors[layout.theme].Primary,
    };
  }

  // computed
  get isChanged(): boolean {
    const selectedPendings: ITransaction[] = accountant.getSelectedTransactions(this.transactionType);
    for (const key of Object.keys(selectedPendings)) {
      const transaction: ITransaction = selectedPendings[key];
      if (manager.transactionHasChanged(transaction.id) === true) {
        return true;
      }
    }

    return false;
  }

  get selectedPendings(): ITransaction[] {
    return accountant.getSelectedTransactions(this.transactionType);
  }

  // methods
}
</script>

<style lang="scss" scoped>
$fixed-width: 2000px;

.edit-user {
  width: 5%;
  max-width: $fixed-width * 0.05;
}

.edit-symbol {
  width: 5%;
  max-width: $fixed-width * 0.05;
}

.edit-date {
  width: 10%;
  max-width: $fixed-width * 0.1;
}

.edit-name {
  width: 33%;
  max-width: $fixed-width * 0.33;
}

.edit-amount {
  width: 5%;
  max-width: $fixed-width * 0.05;
}

.edit-category {
  width: 10%;
  max-width: $fixed-width * 0.10;
}

.edit-note {
  width: 25%;
  max-width:$fixed-width * 0.25;
}

.edit-actions {
  width: 7%;
  max-width: $fixed-width * 0.07;
}
</style>