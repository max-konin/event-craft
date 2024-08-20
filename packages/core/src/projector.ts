import { EventRegistryBase } from './event-registry';

export type Projector<TEventRegistry extends EventRegistryBase> = {
  projectEvent: <TEventType extends keyof TEventRegistry>(
    event: TEventRegistry[TEventType]
  ) => Promise<TEventRegistry[TEventType]>;
};

export type DBTransactionProvider = {
  transaction: <T>(fn: (tx: T) => Promise<unknown>) => Promise<unknown>;
};
