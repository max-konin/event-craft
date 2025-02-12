import { AccountBalanceChangedEvent, AccountCreatedEvent } from './account';
import {
  ACCOUNT_BALANCE_CHANGED,
  ACCOUNT_CREATED_EVENT_TYPE,
} from './event-types';

export type EventRegistry = {
  [ACCOUNT_CREATED_EVENT_TYPE]: AccountCreatedEvent;
  [ACCOUNT_BALANCE_CHANGED]: AccountBalanceChangedEvent;
};
