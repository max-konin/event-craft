'use server';

import { pipe } from 'fp-ts/lib/function';
import { compose, dispatchCommand } from '../domain/app';
import { CreateAccountCommand, findAccountById } from '../domain/account';
import { AccountProjector } from '../domain/account/projectors';
import { ulid } from 'ulidx';
import { respondNull } from '@event-craft/core';
import { revalidatePath } from 'next/cache';

const dispatchCreateAccountCommand = dispatchCommand({
  commandModule: CreateAccountCommand,
  stateLoader: findAccountById,
  projector: compose(AccountProjector),
});

export async function createAccount() {
  await pipe(
    {
      aggregateId: ulid(),
    },
    dispatchCreateAccountCommand,
    respondNull()
  )();
  revalidatePath('/');
}
