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
          >Pending
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
            @click.prevent="showPendingEdit()"
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
          :style="accountant.isSelected(item.id) ? {} : pendingStyle"
        >{{ accountant.getAccountSymbol(item.accountId) }}
        </md-table-cell>
        <md-table-cell 
          md-label="Date" 
          md-sort-by="date"
          class="date"
          :style="accountant.isSelected(item.id) ? {} : pendingStyle"
        >{{ item.date }}
        </md-table-cell>
        <md-table-cell 
          md-label="Name" 
          md-sort-by="name"
          class="name"
          :style="accountant.isSelected(item.id) ? {} : pendingStyle"
        >{{ item.name }}
        </md-table-cell>
        <md-table-cell 
          md-label="Amount" 
          md-sort-by="amount"
          class="amount"
          :style="accountant.isSelected(item.id) ? {} : manager.getAmountStyle(item.amount)"
        >{{ sharedManager.getFormattedAmount(item.amount) }}
        </md-table-cell>
        <md-table-cell 
          md-label="Category" 
          md-sort-by="category"
          class="category"
          :style="accountant.isSelected(item.id) ? {} : pendingStyle"
        >{{ item.expenseCategory }}</md-table-cell>
        <md-table-cell 
          md-label="Note" 
          md-sort-by="note"
          class="note"
          :style="accountant.isSelected(item.id) ? {} : pendingStyle"
        >{{ item.note }}
        </md-table-cell>
        <md-table-cell 
          class="verified"
        >
        </md-table-cell>
      </md-table-row>
    </md-table>
    <!-- todo: remove -->
    <md-button class="md-primary" @click="toLegacy">
      To Legacy
    </md-button>
    <PendingEdit />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import AccountConstants from './_constants';
import manager from './_manager';
import accountant, { ITransaction } from './_store';
import PendingEdit from './PendingEdit.vue';
import LayoutConstants from '@/layout/_constants';
import layout from '@/layout/_store';
import sharedManager from '@/shared/_manager';
import tenant from '@/tenant/_store';

@Component({
  components: {
    PendingEdit,
  },
})
export default class Pending extends Vue {
  // data
  public readonly accountant = accountant;
  public readonly manager = manager;
  public readonly sharedManager = sharedManager;
  public search: string | null = null;
  public searched: ITransaction[] = accountant.pendings;
  public transactionMap = accountant.transactionMap;

  // style
  get pendingStyle(): object {
    return {
      color: AccountConstants.Pending.Colors[layout.theme].Font,
    };
  }

  get titleStyle(): object {
    return {
      color: LayoutConstants.Layout.Colors[layout.theme].Accent,
      fontWeight: 'bold',
    };
  }

  // computed

  // methods
  public getAlternateLabel(count): string {
    const plural = (count > 1) ? 's' : '';

    return `${count} Transaction${plural} selected`;
  }

  public onSelect(transactions: ITransaction[]): void {
    const selectedIds: string[] = transactions.map((t) => t.id);

    accountant.selectTransactions(selectedIds);
  }

  public searchOnTable(): void {
    this.searched = this.searchByName(accountant.pendings, this.search);
  }

  public searchByName(transactions: ITransaction[], term: string | null): ITransaction[] {
    return (term)
      ?  transactions.filter((t) => this.toLower(t.name).includes(this.toLower(term)))
      : transactions;
  }

  public showPendingEdit(): void {
    accountant.togglePendingEdit(true);
  }

  public toLower(text: string) {
    return text.toString().toLowerCase();
  }

  // todo: remove
  public toLegacy(): void {
    window.open(`https://goldstone.azurewebsites.net/expenses?${tenant.id}`, '_blank');
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
