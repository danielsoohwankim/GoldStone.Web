import _ from 'lodash';
import { ExpenseType } from './_data';
import accountant, { IAccount, ITransaction } from './_store';
import {
  GoldStoneExpenseType,
  IGetAccountResponseContract,
  IGetTransactionResponseContract,
  IPutTransactionRequestContractV1,
} from '@/clients/goldStoneClient';
import layout from '@/layout/_store';
import sharedManager from '@/shared/_manager';
import { device } from '@/shared/_tools';
import { goldStoneException } from '@/shared/GoldStoneException';

class AccountantManager {
  public convertToAccount(item: IGetAccountResponseContract): IAccount {
    return {
      id: item.id,
      name: item.name,
      symbol: item.symbol,
      tenantId: item.tenantId,
      type: this.getExpenseType(item.expenseType!),
      userId: item.userId,
    };
  }

  public converToPutTransactionRequest(transaction: ITransaction): IPutTransactionRequestContractV1 {
    return {
      accountId: transaction.accountId,
      amount: transaction.amount,
      date: transaction.date,
      expenseCategory: transaction.expenseCategory,
      id: transaction.id,
      name: transaction.name,
      note: transaction.note,
      tenantId: transaction.tenantId,
      transactionState: transaction.state,
      verified: transaction.verified,
    };
  }

  public convertToTransaction(item: IGetTransactionResponseContract): ITransaction {
    return {
      accountId: item.accountId,
      amount: item.amount,
      date: item.date,
      expenseCategory: item.expenseCategory,
      id: item.id,
      name: item.name,
      note: item.note,
      state: item.transactionState,
      tenantId: item.tenantId,
      verified: item.verified,
    };
  }

  public getAmountStyle(amount: number): object {
    return {
      color: sharedManager.getAmountColor(amount, layout.theme),
    };
  }

  public getScrollStyle(): object {
    return (device.isMobile() === true)
      ? { overflowX: 'scroll' }
      : {};
  }

  public transactionHasChanged(id: string): boolean {
    const transaction: ITransaction = accountant.getTransaction(id);
    const floating: ITransaction = accountant.getFloatingTransaction(id);

    return _.isEqual(transaction, floating) === false;
  }

  private getExpenseType(gsExpenseType: GoldStoneExpenseType): ExpenseType {
    switch (gsExpenseType) {
      case GoldStoneExpenseType.Cash:
        return ExpenseType.Cash;

      case GoldStoneExpenseType.Checking:
        return ExpenseType.Checking;

      case GoldStoneExpenseType.Credit:
        return ExpenseType.Credit;

      case GoldStoneExpenseType.Saving:
        return ExpenseType.Saving;
    }

    throw new goldStoneException('Unknown GoldStoneExpenseType');
  }
}

export default new AccountantManager();
