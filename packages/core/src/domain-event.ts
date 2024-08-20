import { ulid } from 'ulidx';

export type DomainEventDataBase = {
  aggregateId: string;
};

export type DomainEventBase<
  TData extends DomainEventDataBase = DomainEventDataBase,
  TEventType extends string = string,
> = {
  readonly type: TEventType;
  readonly id: string;
  readonly data: TData;
  readonly aggregateVersion: bigint;
};

export const buildEvent = <
  TData extends DomainEventDataBase,
  TEventType extends string,
>(
  event: Omit<DomainEventBase<TData, TEventType>, 'id'>
) => ({
  id: ulid(),
  ...event,
});
