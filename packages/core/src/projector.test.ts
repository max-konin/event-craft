import { vi, test, expect } from 'vitest';
import { initProjectorsBuilder } from './projector';
import { OpenAccountTestEvent, TestEventRegistry } from './test-utils';
import { ulid } from 'ulidx';

const transaction = {
  account: {
    create: vi.fn(),
  },
};

type ProjectorContext = typeof transaction;

test('.initProjectorsBuilder', async () => {
  const { project, buildProjector } = initProjectorsBuilder<
    TestEventRegistry,
    ProjectorContext
  >((fn) => fn(transaction));

  const projector = buildProjector([
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
