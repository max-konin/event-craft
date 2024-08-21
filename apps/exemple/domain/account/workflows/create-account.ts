import { left, right } from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import { z } from 'zod';
import { ACCOUNT_CREATED_EVENT_TYPE } from '../../event-types';
import { buildEvent } from '@event-craft/core';
import { bindExecution } from '../../app';
import { AccountOrNull } from '../queries';

export const createAccountInputSchema = z.object({
  aggregateId: z.string(),
});

export type CreateAccountInput = z.infer<typeof createAccountInputSchema>;

export type AccountCreatedEventData = CreateAccountInput;

export const buildAccountCreatedEvent = (
  data: AccountCreatedEventData,
  aggregateVersion: bigint
) =>
  buildEvent({
    type: ACCOUNT_CREATED_EVENT_TYPE,
    data,
    aggregateVersion,
  });

export type AccountCreatedEvent = ReturnType<typeof buildAccountCreatedEvent>;

export const CreateAccountCommand = pipe(
  {
    type: 'CREATE_ACCOUNT_COMMAND' as const,
    schema: createAccountInputSchema,
  },
  bindExecution((account: AccountOrNull, { data }) => {
    if (account) {
      return left('Account already exists');
    }

    return right(buildAccountCreatedEvent(data, BigInt(1)));
  })
);
