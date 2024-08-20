import EventEmitter2, { type ConstructorOptions } from 'eventemitter2';

import { EventRegistryBase } from './event-registry';

export type EmitEventFn = <
  TEventRegistry extends EventRegistryBase,
  TEventType extends keyof TEventRegistry,
>(
  event: TEventRegistry[TEventType]
) => unknown;

export type SubscribeOnFn = <
  TEventRegistry extends EventRegistryBase,
  TEventType extends keyof TEventRegistry,
>(
  eventType: TEventType,
  fn: (event: TEventRegistry[TEventType]) => unknown
) => unknown;

export const buildEventEmitter = <TEventRegistry extends EventRegistryBase>(
  options: ConstructorOptions = {}
) => {
  const eventEmitter = new EventEmitter2(options);

  type EventType = keyof TEventRegistry;

  return {
    emitEvent: async <TEventType extends EventType>(
      event: TEventRegistry[TEventType]
    ) => {
      await eventEmitter.emitAsync(event.type, event);
      return event;
    },
    subscribeOn: <TEventType extends EventType>(
      eventType: TEventType,
      fn: (event: TEventRegistry[TEventType]) => unknown
    ) => {
      eventEmitter.on(eventType as string, fn);
    },
  };
};

export type EventEmitter = ReturnType<typeof buildEventEmitter>;
