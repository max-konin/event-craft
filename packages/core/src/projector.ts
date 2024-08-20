import { EventRegistryBase } from './event-registry';

export type Projector<TEventRegistry extends EventRegistryBase> = {
  projectEvent: <TEventType extends keyof TEventRegistry>(
    event: TEventRegistry[TEventType]
  ) => Promise<TEventRegistry[TEventType]>;
};

export type DBTransactionProvider<T> = {
  transaction: (fn: (tx: T) => Promise<unknown>) => Promise<unknown>;
};

export const buildProjector = <
  TEventRegistry extends EventRegistryBase,
  TTransaction,
>(
  transactionProvider: DBTransactionProvider<TTransaction>
) => {
  type Transaction = Parameters<
    Parameters<typeof transactionProvider.transaction>[0]
  >[0];

  const project = <TEventType extends keyof TEventRegistry>(
    eventType: TEventType,
    fn: (tx: Transaction, event: TEventRegistry[TEventType]) => Promise<unknown>
  ) => ({
    eventType,
    fn,
  });

  type EventProject = ReturnType<typeof project>;

  const withTransaction = (projectors: EventProject[]) => ({
    projectEvent: async <TEventType extends keyof TEventRegistry>(
      event: TEventRegistry[TEventType]
    ) => {
      transactionProvider.transaction(async (tx) => {
        for (const p of projectors.filter(
          (el) => el.eventType === event.type
        )) {
          await p.fn(tx, event);
        }
      });
    },
  });

  return {
    project,
    withTransaction,
  };
};
