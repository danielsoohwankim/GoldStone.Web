import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { AxiosResponse } from 'Axios';
import _ from 'lodash';
import { ExpenseCategory, ExpenseType, TransactionState, TransactionType } from './_data';
import manager from './_manager';
import goldStoneClient from '@/clients/goldStoneClient';
import {
  IGetAccountResponseContract,
  IGetTransactionResponseContract,
  IGetUserResponseContract,
  IPutTransactionRequestContractV1,
} from '@/clients/goldStoneClient';
import { Menus } from '@/layout/_data';
import layout from '@/layout/_store';
import loaderAction from '@/layout/loaderAction';
import sharedManager from '@/shared/_manager';
import store from '@/shared/_store';
import { Date } from '@/shared/Date';
import tenantManager from '@/tenant/_manager';
import tenant, { IUser } from '@/tenant/_store';

export interface IAccount {
  id: string;
  name: string;
  symbol: string;
  tenantId: string;
  type: ExpenseType;
  userId: string;
}

interface IAccountantState {
  accounts: { [ key: string ]: IAccount };
  floatingTransactions: { [ id: string ]: ITransaction };
  transactions: { [ id: string ]: ITransaction };
  selectedDeleteTransactionType: TransactionType | undefined;
  selectedPendingIds: string[];
  selectedTransactionIds: string[];
  showDeleteTransactions: boolean;
  showEditPendings: boolean;
  showEditTransactions: boolean;
}

export interface ITransaction {
  accountId: string;
  amount: number;
  date: string;
  expenseCategory: ExpenseCategory;
  id: string;
  isPending: boolean;
  mergedDate?: string;
  name: string;
  note: string;
  tenantId: string;
  verifiedDate?: string;
}

// initial state
const initialState: IAccountantState = {
  accounts: {},
  floatingTransactions: {},
  transactions: {},
  selectedDeleteTransactionType: undefined,
  selectedPendingIds: [],
  selectedTransactionIds: [],
  showDeleteTransactions: false,
  showEditPendings: false,
  showEditTransactions: false,
};

const path: string = Menus.Accountant.path;

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

  get selectedDeleteTransactionType(): TransactionType | undefined {
    return this.State.selectedDeleteTransactionType;
  }

  get selectedPendingIds(): string[] {
    return this.State.selectedPendingIds;
  }

  get selectedTransactionIds(): string[] {
    return this.State.selectedTransactionIds;
  }

  get showDeleteTransactions(): boolean {
    return this.State.showDeleteTransactions;
  }

  get showEditPendings(): boolean {
    return this.State.showEditPendings;
  }

  get showEditTransactions(): boolean {
    return this.State.showEditTransactions;
  }

  /* getters with parameters */
  get getAccount() {
    return (id: string): IAccount => this.State.accounts[id];
  }

  get getAccountSymbol() {
    return (accountId: string): string =>
      (this.getAccount(accountId))
        ? this.getAccount(accountId).symbol
        : '';
  }

  get getFloatingTransaction() {
    return (id: string): ITransaction => this.State.floatingTransactions[id];
  }

  get getFloatingTransactions() {
    return (type: TransactionType): ITransaction[] =>
      (type === TransactionType.Pending)
        ? _.values(this.State.floatingTransactions)
          .filter((t) => t.state === TransactionState.Pending)
        : _.values(this.State.floatingTransactions)
          .filter((t) => t.state !== TransactionState.Pending);
  }

  get getSelectedFloatingTransaction() {
    return (id: string): ITransaction =>
      this.context.getters.getSelectedFloatingTransactions().filter((t) => t.id === id)[0];
  }

  get getSelectedFloatingTransactions() {
    return (type?: TransactionType): ITransaction[] => {
      const selectedTransactions: ITransaction[] = [];
      const selectedIds: string[] =
        (type === undefined)
        ? [
          ...this.State.selectedPendingIds,
          ...this.State.selectedTransactionIds,
        ] : (type === TransactionType.Pending)
          ? this.State.selectedPendingIds
          : this.State.selectedTransactionIds;

      selectedIds.forEach((id) => {
        if (this.State.floatingTransactions[id]) {
          selectedTransactions.push(this.State.floatingTransactions[id]);
        }
      });

      return selectedTransactions.sort((a, b) => b.date.localeCompare(a.date));
    };
  }

  get getSelectedTransactions() {
    return (type: TransactionType): ITransaction[] => {
      const transactions: ITransaction[] = [];
      const selectedIds: string[] = (type === TransactionType.Pending)
        ? this.State.selectedPendingIds
        : this.State.selectedTransactionIds;

      selectedIds.forEach((id) =>
        transactions.push(this.getTransaction(id)));

      return transactions;
    };
  }

  get getTransaction() {
    return (id: string): ITransaction => this.State.transactions[id];
  }

  get getTransactions() {
    return (type: TransactionType): ITransaction[] =>
      (type === TransactionType.Pending)
        ? this.transactions.filter((t) => this.getTransactionState(t.id) === TransactionState.Pending)
        : this.transactions.filter((t) => this.getTransactionState(t.id) !== TransactionState.Pending);
  }

  get getTransactionState() {
    return (id: string): TransactionState => {
      const transaction: ITransaction = this.State.transactions[id];

      if (transaction.verifiedDate) {
        return TransactionState.Verified;
      } else if (transaction.mergedDate) {
        return TransactionState.Merged;
      } else if (transaction.isPending === false) {
        return TransactionState.Settled;
      } else {
        return TransactionState.Pending;
      }
    };
  }

  get getUserProfileImage() {
    return (accountId: string): string | undefined => {
      const account = this.getAccount(accountId);
      const user = tenant.getUser(account.userId);

      return (user) ? user.profileImageUrl : undefined;
    };
  }

  get isSelected() {
    return (id: string): boolean =>
      this.State.selectedPendingIds.includes(id) ||
      this.State.selectedTransactionIds.includes(id);
  }

  get isVerified() {
    return (id: string): boolean => {
      const transaction: ITransaction = this.State.transactions[id];
      return this.getTransactionState(transaction.id) === TransactionState.Verified;
    };
  }

  @Action
  public clear(showSignInButton: boolean): void {
    this.context.commit('Clear', showSignInButton);
  }

  @Action
  public async deleteTransactionAsync(id: string): Promise<void> {
    if (!this.getTransaction(id)) {
      return;
    }

    const response: AxiosResponse<void | any>
      = await loaderAction.sendAsync(() => goldStoneClient.deleteTransactionAsync(id));

    const result = sharedManager.handleDeleteApiResponse(response, path);
    if (result.success === false) {
      return;
    }

    layout.setSnackBar({
      isSuccess: true,
      message: `Deleted 1 transaction`,
      show: true,
    });

    // unselect row
    // const row = document.getElementById(id);
    // // @ts-ignore
    // row.click();

    this.context.commit('DeleteTransaction', id);
  }

  // @Action({ rawError: true })
  @Action
  public async initAsync(): Promise<void> {
    const startDate: Date = Date.Today().addDays(-3);
    const endDate: Date = Date.Today();
    const getAccountsPromise = goldStoneClient.getAccountsAsync(false, true);
    const getTransactionsPromise = goldStoneClient.getTransactionsAsync(startDate, endDate);
    const getUsersPromise = goldStoneClient.getUsersAsync();
    // @ts-ignore
    const [ getAccountsResponse, getTransactionsResponse, getUsersResponse ]
      = await loaderAction.sendAsync(() => Promise.all([getAccountsPromise, getTransactionsPromise, getUsersPromise]));

    // failed to get accounts
    let result = sharedManager.handleApiResponse(getAccountsResponse, path);
    if (result.success === false) {
      return;
    }

    // failed to get account transactions
    result = sharedManager.handleApiResponse(getTransactionsResponse, path);
    if (result.success === false) {
      return;
    }

    // failed to get users
    result = sharedManager.handleApiResponse(getUsersResponse, path);
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

  @Action
  public resetFloatingTransactions(id: string): void {
    this.context.commit('ResetFloatingTransactions', id);
  }

  @Action
  public resetFloatingTransactionss(type: TransactionType): void {
    const selectedTransactionIds: string[] =
      this.context.getters
        .getSelectedFloatingTransactions(type)
        .map((t) => t.id);

    this.context.commit('ResetFloatingTransactionss', selectedTransactionIds);
  }

  @Action
  public async saveSelectedTransactionAsync(id: string): Promise<void> {
    const selectedTransaction: ITransaction =
      this.context.getters.getSelectedFloatingTransaction(id);
    const request = manager.converToPutTransactionRequest(selectedTransaction);

    const response: AxiosResponse<void | any>
      = await loaderAction.sendAsync(() => goldStoneClient.putTransactionAsync(request));

    const result = sharedManager.handleApiResponse(response, path);
    if (result.success === false) {
      return;
    }

    layout.setSnackBar({
      isSuccess: true,
      message: 'Saved 1 transaction',
      show: true,
    });

    this.context.commit('SaveTransaction', id);
  }

  @Action
  public async saveSelectedTransactionsAsync(type: TransactionType): Promise<void> {
    const selectedTransactions: ITransaction[] =
      this.context.getters.getSelectedFloatingTransactions(type);
    const request: IPutTransactionRequestContractV1[] =
      selectedTransactions
      // only save the transactions that are modified
        .filter((t) => manager.transactionHasChanged(t.id) === true)
        .map((t) => manager.converToPutTransactionRequest(t));

    const response: AxiosResponse<void | any>
      = await loaderAction.sendAsync(() => goldStoneClient.putTransactionsAsync(request));

    const result = sharedManager.handleApiResponse(response, path);
    if (result.success === false) {
      return;
    }

    const plural = (request.length > 1) ? 's' : '';

    layout.setSnackBar({
      isSuccess: true,
      message: `Saved ${request.length} transaction${plural}`,
      show: true,
    });

    const ids: string[] = selectedTransactions.map((t) => t.id);

    this.context.commit('SaveTransactions', {
      ids,
      type,
    });
  }

  @Action
  public selectTransactions(params: {
    ids: string[],
    type: TransactionType,
  }): void {
    const { ids, type } = params;

    this.context.commit('SelectTransactions', params);
  }

  @Action
  public toggleDelete(params: {
    show: boolean,
    type?: TransactionType,
  }): void {
    const { show, type } = params;
    if (show === true && this.State.showDeleteTransactions === true) {
      return;
    } else if (show === false && this.State.showDeleteTransactions === false) {
      return;
    }

    this.context.commit('ToggleDelete', params);
  }

  @Action
  public toggleEdit(params: {
    show: boolean,
    type: TransactionType,
  }): void {
    const { show, type } = params;
    if (type === TransactionType.Pending && this.State.showEditPendings === show) {
      return;
    } else if (type === TransactionType.Transaction && this.State.showEditTransactions === show) {
      return;
    }
    if (show === true) {
      // add floating transactions if they do not exist
      if (type === TransactionType.Pending) {
        this.context.commit('SetFloatingTransactions', this.State.selectedPendingIds);
      } else {
        this.context.commit('SetFloatingTransactions', this.State.selectedTransactionIds);
      }
    }

    this.context.commit('ToggleEdit', params);
  }

  @Action
  public unselectAll(type?: TransactionType): void {
    if (this.State.selectedPendingIds.length <= 0 &&
        this.State.selectedTransactionIds.length <= 0) {
      return;
    }

    this.context.commit('UnselectAll', type);
  }

  /**
   * Opens EditTransaction dialog with only the
   * verifiable transactions selected
   */
  @Action
  public verifyAll(): void {
    if (this.State.showEditTransactions === true) {
      return;
    }

    const verifiableIds: string[] =
      this.getTransactions(TransactionType.Transaction)
          .filter((t) => this.isVerified(t.id) === false)
          .map((t) => t.id);

    if (verifiableIds.length <= 0) {
      return;
    }

    verifiableIds.forEach((id) => {
      if (this.isSelected(id) === true) {
        return;
      }
      // select rows
      const row = document.getElementById(id);
      // @ts-ignore
      row.click();
    });

    this.context.commit('SetFloatingTransactions', verifiableIds);

    this.context.commit('VerifyAll', verifiableIds);
  }

  /**
   * Saves and verifies a transaction
   */
  @Action
  public async verifySelectedTransactionAsync(params: {
    id: string,
    verify: boolean,
  }): Promise<void> {
    const { id, verify } = params;
    const selectedTransaction: ITransaction =
      this.getSelectedFloatingTransaction(id);
    const currentState: TransactionState =
      this.getTransactionState(selectedTransaction.id);

    if (verify === true && currentState === TransactionState.Verified) {
      return;
    } else if (verify === false && currentState !== TransactionState.Verified) {
      return;
    }

    const verifiedDate = (verify === true) ? sharedManager.getUtcNowDateTimeStr() : undefined;
    const verifiedTransaction: ITransaction = {
      ...selectedTransaction,
      verifiedDate,
    };
    const request = manager.converToPutTransactionRequest(verifiedTransaction);

    const response: AxiosResponse<void | any>
      = await loaderAction.sendAsync(() => goldStoneClient.putTransactionAsync(request));

    const result = sharedManager.handleApiResponse(response, path);
    if (result.success === false) {
      return;
    }

    const verifyStr: string = (verify === true) ? 'Verified' : 'Unverified';

    layout.setSnackBar({
      isSuccess: true,
      message: `${verifyStr} and saved 1 transaction`,
      show: true,
    });

    this.context.commit('VerifyTransaction', {
      id,
      verifiedDate,
    });
  }

  /**
   * Saves and verifies selected eligible transactions
   */
  @Action
  public async verifySelectedTransactionsAsync(): Promise<void> {
    const selectedTransactions: ITransaction[] =
      this.context.getters.getSelectedFloatingTransactions(TransactionType.Transaction);
    const verifiableTransactions: ITransaction[] =
      selectedTransactions.filter((t) =>
        this.getTransactionState(t.id) !== TransactionState.Verified);
    const verifiedDate = sharedManager.getUtcNowDateTimeStr();
    const request = verifiableTransactions.map((t) => {
      return {
        ...manager.converToPutTransactionRequest(t),
        verifiedDate,
      };
    });

    const response: AxiosResponse<void | any>
      = await loaderAction.sendAsync(() => goldStoneClient.putTransactionsAsync(request));

    const result = sharedManager.handleApiResponse(response, path);
    if (result.success === false) {
      return;
    }

    const plural = (request.length > 1) ? 's' : '';

    layout.setSnackBar({
      isSuccess: true,
      message: `Verified and saved ${request.length} transaction${plural}`,
      show: true,
    });

    const ids: string[] = verifiableTransactions.map((t) => t.id);

    this.context.commit('VerifyTransactions', {
      ids,
      verifiedDate,
    });
  }

  @Mutation
  private Clear(showSignInButton: boolean): void {
    const state: IAccountantState = _.cloneDeep(initialState);

    this.State = state;
  }

  @Mutation
  private DeleteTransaction(id: string): void {
    const copy = _.cloneDeep(this.State.transactions);
    delete copy[id];
    this.State.transactions = copy;

    if (this.State.floatingTransactions[id]) {
      delete this.State.floatingTransactions[id];
    }
    if (this.State.selectedPendingIds.includes(id) === true) {
      this.State.selectedPendingIds.splice(this.State.selectedPendingIds.indexOf(id), 1);
    }
    if (this.State.selectedTransactionIds.includes(id) === true) {
      this.State.selectedTransactionIds.splice(this.State.selectedTransactionIds.indexOf(id), 1);
    }
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

  @Mutation
  private ResetFloatingTransactions(id: string): void {
    this.State.floatingTransactions[id] = _.cloneDeep(this.State.transactions[id]);
  }

  @Mutation
  private ResetFloatingTransactionss(ids: string[]): void {
    ids.forEach((id) => {
      this.State.floatingTransactions[id] = _.cloneDeep(this.State.transactions[id]);
    });
  }

  @Mutation
  private SaveTransaction(id: string): void {
    this.State.transactions[id] = _.cloneDeep(this.State.floatingTransactions[id]);
  }

  /**
   * Saves and closes the edit dialog upon saving
   */
  @Mutation
  private SaveTransactions(params: {
    ids: string[],
    type: TransactionType,
  }): void {
    const { ids, type } = params;

    ids.forEach((id) => {
      this.State.transactions[id] = _.cloneDeep(this.State.floatingTransactions[id]);
    });

    const selectedIds: string[] = (type === TransactionType.Pending)
      ? this.State.selectedPendingIds
      : this.State.selectedTransactionIds;

    selectedIds.forEach((id) => {
      // deselect rows
      const row = document.getElementById(id);
      // @ts-ignore
      row.click();
    });

    if (type === TransactionType.Pending) {
      this.State.showEditPendings = false;
    } else {
      this.State.showEditTransactions = false;
    }
  }

  @Mutation
  private SelectTransactions(params: {
    ids: string[],
    type: TransactionType,
  }): void {
    const { ids, type } = params;

    if (type === TransactionType.Pending) {
      this.State.selectedPendingIds = _.cloneDeep(ids);
    } else {
      this.State.selectedTransactionIds = _.cloneDeep(ids);
    }
  }

  @Mutation
  private SetFloatingTransactions(ids: string[]): void {
    const floatingTransactions = _.cloneDeep(this.State.floatingTransactions);

    ids.forEach((id) => {
      // don't touch already existing floating transactions.
      // copy only the newly added transactions
      if (!floatingTransactions[id]) {
        floatingTransactions[id] = _.cloneDeep(this.State.transactions[id]);
      }
    });

    this.State.floatingTransactions = floatingTransactions;
  }

  @Mutation
  private ToggleDelete(params: {
    show: boolean,
    type?: TransactionType,
  }): void {
    const { show, type } = params;

    this.State.showDeleteTransactions = show;
    this.State.selectedDeleteTransactionType =
      (show === true) ? type : undefined;
  }

  @Mutation
  private ToggleEdit(params: {
    show: boolean,
    type: TransactionType,
  }): void {
    const { show, type } = params;

    if (type === TransactionType.Pending) {
      this.State.showEditPendings = show;
    } else if (type === TransactionType.Transaction) {
      this.State.showEditTransactions = show;
    }
  }

  @Mutation
  private UnselectAll(type?: TransactionType): void {
    const selectedIds: string[] =
      (type === undefined) ? [
      ...this.State.selectedPendingIds,
      ...this.State.selectedTransactionIds,
    ] : (type === TransactionType.Pending)
      ? this.State.selectedPendingIds
      : this.State.selectedTransactionIds;

    selectedIds.forEach((id) => {
      // select rows
      const row = document.getElementById(id);
      // @ts-ignore
      row.click();
    });
  }

  @Mutation
  private VerifyAll(ids: string[]): void {
    this.State.showEditTransactions = true;
    this.State.selectedTransactionIds = [
      ...ids,
    ];
  }

  @Mutation
  private VerifyTransaction(params: {
    id: string,
    verifiedDate?: string,
  }): void {
    const { id, verifiedDate } = params;
    const transaction: ITransaction = {
      ..._.cloneDeep(this.State.floatingTransactions[id]),
      verifiedDate,
    };

    this.State.transactions[id] = transaction;
    this.State.floatingTransactions[id] = _.cloneDeep(transaction);
  }

  /**
   * Verifies, saves and closes the edit dialog upon updating
   */
  @Mutation
  private VerifyTransactions(params: {
    ids: string[],
    verifiedDate: string,
  }): void {
    const { ids, verifiedDate } = params;

    ids.forEach((id) => {
      this.State.floatingTransactions[id] = {
        ..._.cloneDeep(this.State.floatingTransactions[id]),
        verifiedDate,
      };
      this.State.transactions[id] = {
        ..._.cloneDeep(this.State.transactions[id]),
        verifiedDate,
      };
    });

    this.State.selectedTransactionIds.forEach((id) => {
      // deselect rows
      const row = document.getElementById(id);
      // @ts-ignore
      row.click();
    });

    this.State.showEditTransactions = false;
  }
}

export default getModule(AccountantStore);
