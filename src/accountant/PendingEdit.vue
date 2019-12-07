<template>
  <div v-if="accountant.showPendingEdit">
    <md-dialog 
      :md-active="accountant.showPendingEdit"
      style="width: 90%;"
      :style="manager.getScrollStyle()">
      <md-dialog-title :style="titleStyle">Edit Pending Transactions</md-dialog-title>

      <md-table
        v-model="accountant.selectedFloatingPendings"
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
                @click="test(item.id)"
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
        <md-button @click="accountant.togglePendingEdit(false)">Close</md-button>
        <md-button class="md-primary" @click="accountant.resetFloatingTransactions()">Reset All</md-button>
        <md-button class="md-accent" @click="accountant.saveFloatingTransactionsAsync">Save All</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
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
export default class PendingEdit extends Vue {
  // data
  public readonly accountant = accountant;
  public readonly delay = SharedConstants.Tooltip.Delay;
  public readonly manager = manager;
  public readonly sharedManager = sharedManager;

  // styles
  get titleStyle(): object {
    return {
      color: LayoutConstants.Layout.Colors[layout.theme].Primary,
    };
  }

  // computed

  // methods
  // todo: remove
  public test(id: string) {
    // tslint:disable-next-line
    console.log('original', accountant.getTransaction(id).expenseCategory);
    // tslint:disable-next-line
    // console.log('copy', accountant.selectedTransactions[0].expenseCategory);
  }
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
  width: 33.5%;
  max-width: $fixed-width * 0.33.5;
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
  width: 6.5%;
  max-width: $fixed-width * 0.065;
}
</style>