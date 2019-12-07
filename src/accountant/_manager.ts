import _ from 'lodash';
import { ExpenseType } from './_data';
import { IAccount, ITransaction } from './_store';
import {
  IGetAccountResponseContract,
  IGetTransactionResponseContract,
  GoldStoneExpenseType,
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

  public convertToTransaction(item: IGetTransactionResponseContract): ITransaction {
    return {
      accountId: item.accountId,
      amount: item.amount,
      date: item.date,
      expenseCategory: item.expenseCategory,
      id: item.id,
      name: item.name,
      note: item.note,
      plaidPendingId: item.plaidPendingId,
      plaidTransactionId: item.plaidTransactionId,
      state: item.transactionState,
      tenantId: item.tenantId,
      verifiedDate: item.verifiedDate,
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
