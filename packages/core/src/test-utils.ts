import { DomainEventBase } from './domain-event';

export const OPEN_ACCOUNT = 'OPEN_ACCOUNT' as const;

export type OpenAccountTestEvent = DomainEventBase<
  { creditLimit: number; aggregateId: string },
  typeof OPEN_ACCOUNT
>;

export type TestEventRegistry = {
  [OPEN_ACCOUNT]: OpenAccountTestEvent;
};
