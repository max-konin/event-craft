import { project } from '../../app';
import { ACCOUNT_CREATED_EVENT_TYPE } from '../../event-types';

export const AccountProjector = [
  project(ACCOUNT_CREATED_EVENT_TYPE, async (tx, { data: { aggregateId } }) => {
    await tx.account.create({
      data: {
        id: aggregateId,
        balance: 0,
        aggregateVersion: 1n,
      },
    });
  }),
];
