import { project, buildProjector } from '../../app';
import {
  ACCOUNT_BALANCE_CHANGED,
  ACCOUNT_CREATED_EVENT_TYPE,
} from '../../event-types';

export const AccountProjector = buildProjector([
  project(ACCOUNT_CREATED_EVENT_TYPE, async (tx, { data: { aggregateId } }) => {
    await tx.account.create({
      data: {
        id: aggregateId,
        balance: 0,
        aggregateVersion: 1n,
      },
    });
  }),
  project(
    ACCOUNT_BALANCE_CHANGED,
    async (tx, { data: { aggregateId, newBalance }, aggregateVersion }) => {
      await tx.account.update({
        where: {
          id: aggregateId,
        },
        data: {
          balance: newBalance,
          aggregateVersion,
        },
      });
    }
  ),
]);
