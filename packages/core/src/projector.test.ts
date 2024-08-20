import { vi, test, expect } from 'vitest';
import { buildProjector, DBTransactionProvider, Projector } from './projector';
import { OpenAccountTestEvent, TestEventRegistry } from './test-utils';
import { ulid } from 'ulidx';

const transaction = {
  account: {
    create: vi.fn(),
  },
};

const mockTransactionProvider: DBTransactionProvider<typeof transaction> = {
  transaction: async (fn) => {
    await fn(transaction);
  },
};

test('.buildProjector', async () => {
  const { project, withTransaction } = buildProjector<
    TestEventRegistry,
    typeof transaction
  >(mockTransactionProvider);

  const projector = withTransaction([
    project('OPEN_ACCOUNT', async (tx, event) => {
      await tx.account.create(event.data);
    }),
  ]);

  const event: OpenAccountTestEvent = {
    id: ulid(),
    data: {
      creditLimit: 100,
      aggregateId: ulid(),
    },
    type: 'OPEN_ACCOUNT',
    aggregateVersion: 1n,
  };

  await projector.projectEvent(event);

  expect(transaction.account.create).toHaveBeenCalledWith(event.data);
});
