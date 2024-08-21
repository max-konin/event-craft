import { AccountCreatedEvent } from './account';
import { ACCOUNT_CREATED_EVENT_TYPE } from './event-types';

export type EventRegistry = {
  [ACCOUNT_CREATED_EVENT_TYPE]: AccountCreatedEvent;
};
