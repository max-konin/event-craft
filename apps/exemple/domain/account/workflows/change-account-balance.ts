import { left, right } from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import { z } from 'zod';
import { ACCOUNT_BALANCE_CHANGED } from '../../event-types';
import { buildEvent } from '@event-craft/core';
import { bindExecution } from '../../app';
import { Account } from '../queries';

export const changeAccountBalanceInputSchema = z.object({
  aggregateId: z.string(),
  value: z.number(),
});

export type ChangeAccountBalanceInput = z.infer<
  typeof changeAccountBalanceInputSchema
>;

export type AccountBalanceChangedEventData = ChangeAccountBalanceInput & {
  newBalance: number;
};

export const buildAccountBalanceChangedEvent = (
  data: AccountBalanceChangedEventData,
  aggregateVersion: bigint
) =>
  buildEvent({
    type: ACCOUNT_BALANCE_CHANGED,
    data,
    aggregateVersion,
  });

export type AccountBalanceChangedEvent = ReturnType<
  typeof buildAccountBalanceChangedEvent
>;

export const ChangeAccountBalanceCommand = pipe(
  {
    type: 'CHANGE_ACCOUNT_BALANCE' as const,
    schema: changeAccountBalanceInputSchema,
  },
  bindExecution(({ balance }: Account, { data }) => {
    const newBalance = balance.toNumber() + data.value;
    if (newBalance < 0) {
      return left('Insufficient funds');
    }

    return right(
      buildAccountBalanceChangedEvent(
        {
          ...data,
          newBalance,
        },
        BigInt(1)
      )
    );
  })
);
