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

/**
 * Builds a domain event with a unique identifier.
 *
 * @param event - The domain event object w/o ID.
 * @returns A new domain event object with a unique identifier.
 */
export const buildEvent = <
  TData extends DomainEventDataBase,
  TEventType extends string,
>(
  event: Omit<DomainEventBase<TData, TEventType>, 'id'>
) => ({
  id: ulid(),
  ...event,
});
