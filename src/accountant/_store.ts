import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import _ from 'lodash';
import { ExpenseCategory, TransactionState } from './_data';
import manager from './_manager';
import goldStoneClient from '@/clients/goldStoneClient';
import { IGetAccountResponseContract, IGetTransactionResponseContract, IGetUserResponseContract } from '@/clients/goldStoneClient';
import loaderAction from '@/layout/loaderAction';
import sharedManager from '@/shared/_manager';
import store from '@/shared/_store';
import { Date } from '@/shared/Date';
import tenantManager from '@/tenant/_manager';
import tenant, { IUser } from '@/tenant/_store';

export interface IAccount {
  id: string;
  userId: string;
}

interface IAccountantState {
  accounts: { [ key: string ]: IAccount };
  transactions: { [ id: string ]: ITransaction };
}

export interface ITransaction {
  accountId: string;
  amount: number;
  date: string;
  expenseCategory: ExpenseCategory;
  id: string;
  name: string;
  note: string;
  plaidPendingId: string;
  plaidTransactionId: string;
  state: TransactionState;
  tenantId: string;
  verifiedDate: string;
}

// initial state
const initialState: IAccountantState = {
  accounts: {},
  transactions: {},
};

@Module({
  namespaced: true,
  name: 'AccountantStore',
  store,
  dynamic: true,
})
class AccountantStore extends VuexModule {
  // lowercase 'state' is reserved in Vuex
  private State: IAccountantState = _.cloneDeep(initialState);

  get transactions(): ITransaction[] {
    return _.values(this.State.transactions);
  }

  get transactionMap(): { [ id: string]: ITransaction } {
    return this.State.transactions;
  }

  get pendingTransactions(): ITransaction[] {
    return this.transactions.filter((t) => t.state === TransactionState.Pending);
  }

  /* getters with parameters */
  get getAccount() {
    return (id: string): IAccount => this.State.accounts[id];
  }

  @Action
  public clear(showSignInButton: boolean): void {
    this.context.commit('Clear', showSignInButton);
  }

  @Action
  public async initAsync(): Promise<void> {
    const startDate: Date = Date.Today().addDays(-2);
    const endDate: Date = Date.Today();
    const getAccountsPromise = goldStoneClient.getAccountsAsync(true);
    const getTransactionsPromise = goldStoneClient.getTransactionsAsync(startDate, endDate);
    const getUsersPromise = goldStoneClient.getUsersAsync();
    // @ts-ignore
    const [ getAccountsResponse, getTransactionsResponse, getUsersResponse ]
      = await loaderAction.sendAsync(() => Promise.all([getAccountsPromise, getTransactionsPromise, getUsersPromise]));

    // failed to get accounts
    let result = sharedManager.handleApiResponse(getAccountsResponse);
    if (result.success === false) {
      return;
    }

    // failed to get account transactions
    result = sharedManager.handleApiResponse(getTransactionsResponse);
    if (result.success === false) {
      return;
    }

    // failed to get users
    result = sharedManager.handleApiResponse(getUsersResponse);
    if (result.success === false) {
      return;
    }

    const accountResponses = getAccountsResponse.data as IGetAccountResponseContract[];
    const transactionResponses = getTransactionsResponse.data as IGetTransactionResponseContract[];
    const userResponses = getUsersResponse.data as IGetUserResponseContract[];

    if (!accountResponses || !transactionResponses || !userResponses ||
        accountResponses.length <= 0 || transactionResponses.length <= 0 || userResponses.length <= 0) {
      return;
    }

    const accountList: IAccount[] = accountResponses.map((a) => manager.convertToAccount(a));
    const transactionList: ITransaction[] = transactionResponses.map((c) => manager.convertToTransaction(c));
    const userList: IUser[] = userResponses.map((u) => tenantManager.convertToUser(u));
    const accounts: { [ key: string ]: IAccount } = _.keyBy(accountList, (a) => a.id);
    const transactions: { [ key: string ]: ITransaction } = _.keyBy(transactionList, (c) => c.id);
    const users: { [ key: string ]: IUser } = _.keyBy(userList, (u) => u.id);

    tenant.setUsers(users);
    this.context.commit('Init', { accounts, transactions });
  }

  @Mutation
  private Clear(showSignInButton: boolean): void {
    const state: IAccountantState = _.cloneDeep(initialState);

    this.State = state;
  }

  @Mutation
  private Init(params: {
    accounts: { [ key: string ]: IAccount },
    transactions: { [ key: string ]: ITransaction } }): void {
    const { accounts, transactions } = params;

    this.State = {
      ...this.State,
      accounts: _.cloneDeep(accounts),
      transactions: _.cloneDeep(transactions),
    };
  }
}

export default getModule(AccountantStore);
