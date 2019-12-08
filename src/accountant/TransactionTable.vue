<template>
  <div>
    <md-table
      v-model="searched"
      md-card
      md-fixed-header
      md-sort="date"
      md-sort-order="desc"
      :style="manager.getScrollStyle()"
      @md-selected="onSelect"
    >
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 
            class="md-title"
            :style="titleStyle"
          >{{ `${type}s` }}
          </h1>
        </div>

        <md-field 
          md-clearable
          class="md-toolbar-section-end"
          style="max-width: 300px;"
        >
          <md-input
            placeholder="Search by name"
            v-model="search" 
            @input="searchOnTable"
          />
        </md-field>
      </md-table-toolbar>

      <md-table-toolbar slot="md-table-alternate-header" slot-scope="{ count }">
        <div class="md-toolbar-section-start">{{ getAlternateLabel(count) }}</div>
        <div class="md-toolbar-section-end">
          <md-button
            class="md-icon-button"
            @click.prevent="showEdit()"
          >
            <md-icon>edit</md-icon>
          </md-button>
          <md-button class="md-icon-button">
            <md-icon>delete</md-icon>
          </md-button>
        </div>
      </md-table-toolbar>

      <md-table-empty-state
        md-label="No transactions found"
        :md-description="`No transaction found for this '${search}' query. Try a different search term.`">
      </md-table-empty-state>

      <md-table-row
        :id="item.id"
        slot="md-table-row" 
        slot-scope="{ item }"
        class="md-primary"
        md-selectable="multiple"
        md-auto-select
        style="height: 57px;"
      >
        <md-table-cell 
          md-label="Users"
          class="user"
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
          class="symbol"
          :style="accountant.isSelected(item.id) ? {} : getRowStyle(item.id)"
        >{{ accountant.getAccountSymbol(item.accountId) }}
        </md-table-cell>
        <md-table-cell 
          md-label="Date" 
          md-sort-by="date"
          class="date"
          :style="accountant.isSelected(item.id) ? {} : getRowStyle(item.id)"
        >{{ getDate(item.id) }}
        </md-table-cell>
        <md-table-cell 
          md-label="Name" 
          md-sort-by="name"
          class="name"
          :style="accountant.isSelected(item.id) ? {} : getRowStyle(item.id)"
        >{{ getName(item.id) }}
        </md-table-cell>
        <md-table-cell 
          md-label="Amount" 
          md-sort-by="amount"
          class="amount"
          :style="accountant.isSelected(item.id) ? {} : manager.getAmountStyle(item.amount)"
        >{{ getAmount(item.id) }}
        </md-table-cell>
        <md-table-cell 
          md-label="Category" 
          md-sort-by="category"
          class="category"
          :style="accountant.isSelected(item.id) ? {} : getRowStyle(item.id)"
        >{{ getCategory(item.id) }}</md-table-cell>
        <md-table-cell 
          md-label="Note" 
          md-sort-by="note"
          class="note"
          :style="accountant.isSelected(item.id) ? {} : getRowStyle(item.id)"
        >{{ getNote(item.id) }}
        </md-table-cell>
        <md-table-cell 
          class="verified"
          :md-label="(showVerified === true) ? 'Verified' : ''"
        >
          <Verify
            v-if="showVerified === true"
            :iconStyle="getVerifyStyle(item.id)"
            :transactionId="item.id"
          />
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import AccountConstants from './_constants';
import { ExpenseCategory, TransactionState, TransactionType } from './_data';
import manager from './_manager';
import accountant, { ITransaction } from './_store';
import Verify from './Verify.vue';
import LayoutConstants from '@/layout/_constants';
import layout from '@/layout/_store';
import sharedManager from '@/shared/_manager';

@Component({
  components: {
    Verify,
  },
})
export default class TransactionTable extends Vue {
  @Prop() public readonly type!: TransactionType;
  // data
  public readonly accountant = accountant;
  public readonly manager = manager;
  public readonly sharedManager = sharedManager;
  public readonly showVerified = this.type === TransactionType.Transaction;
  public search: string | null = null;
  public searched: ITransaction[] = accountant.getTransactions(this.type);
  public transactionMap = accountant.transactionMap;

  // style
  get titleStyle(): object {
    return {
      color: LayoutConstants.Layout.Colors[layout.theme].Accent,
      fontWeight: 'bold',
    };
  }

  // computed

  // methods
  public getAmount(id: string): string {
    const transaction: ITransaction = accountant.getTransaction(id);
    return sharedManager.getFormattedAmount(transaction.amount);
  }

  public getAlternateLabel(count): string {
    const prefix: string = (this.type === TransactionType.Pending)
      ? 'pending ' : '';
    const plural: string = (count > 1) ? 's' : '';

    return `${count} ${prefix}transaction${plural} selected`;
  }

  public getCategory(id: string): ExpenseCategory {
    return accountant.getTransaction(id).expenseCategory;
  }

  public getDate(id: string): string {
    const transaction: ITransaction = accountant.getTransaction(id);
    return accountant.getTransaction(id).date;
  }

  public getName(id: string): string {
    const transaction: ITransaction = accountant.getTransaction(id);
    return accountant.getTransaction(id).name;
  }

  public getNote(id: string): string {
    return accountant.getTransaction(id).note;
  }

  public getRowStyle(id: string): object {
    const transaction: ITransaction = accountant.getTransaction(id);
    const state: TransactionState = accountant.getTransactionState(id);
    if (state === TransactionState.Verified) {
      return {};
    }

    return {
      color: AccountConstants.Layout.Colors[layout.theme][state],
    };
  }

  public getVerifyStyle(id: string): object {
    if (accountant.isSelected(id) === false) {
      return this.getRowStyle(id);
    }

    return {
      color: AccountConstants.Layout.Colors[layout.theme].Selected,
    };
  }

  public onSelect(transactions: ITransaction[]): void {
    const selectedIds: string[] = transactions.map((t) => t.id);

    accountant.selectTransactions({
      ids: selectedIds,
      type: this.type,
    });
  }

  public searchOnTable(): void {
    const transactions: ITransaction[] = accountant.getTransactions(this.type);
    this.searched = this.searchByName(transactions, this.search);
  }

  public searchByName(transactions: ITransaction[], term: string | null): ITransaction[] {
    return (term)
      ?  transactions.filter((t) => this.toLower(t.name).includes(this.toLower(term)))
      : transactions;
  }

  public showEdit(): void {
    accountant.toggleEdit({
      show: true,
      type: this.type,
    });
  }

  public toLower(text: string): string {
    return text.toString().toLowerCase();
  }
}
</script>

<style lang="scss" scoped>
$fixed-width: 2500px;

.user {
  width: 3%;
  max-width: $fixed-width * 0.03;
}

.symbol {
  width: 5%;
  max-width: $fixed-width * 0.05;
}

.date {
  width: 7%;
  max-width: $fixed-width * 0.07;
}

.name {
  // todo
  width: 500px;
  max-width: $fixed-width * 0.43;
}

.amount {
  width: 5%;
  max-width: $fixed-width * 0.05;
}

.category {
  width: 7%;
  max-width: $fixed-width * 0.07;
}

.note {
  width: 25%;
  max-width:$fixed-width * 0.25;
}

.verified {
  width: 5%;
  max-width: $fixed-width * 0.05;
}
</style>
