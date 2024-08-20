import { DomainEventBase } from './domain-event';

export type EventRegistryBase = Record<string, DomainEventBase>;
