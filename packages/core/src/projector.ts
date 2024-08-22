import { DomainEventBase } from './domain-event';
import { EventRegistryBase } from './event-registry';

export type Projector<TEventRegistry extends EventRegistryBase> = {
  projectEvent: <TEventType extends keyof TEventRegistry>(
    event: TEventRegistry[TEventType]
  ) => Promise<TEventRegistry[TEventType]>;
};

export const buildProjector = <
  TEventRegistry extends EventRegistryBase,
  TContext,
>(
  aroundProjection: (
    fn: (ctx: TContext) => Promise<unknown>,
    event: DomainEventBase
  ) => Promise<unknown>
) => {
  const project = <TEventType extends keyof TEventRegistry>(
    eventType: TEventType,
    fn: (ctx: TContext, event: TEventRegistry[TEventType]) => Promise<unknown>
  ) => ({
    eventType,
    fn,
  });

  type EventProject = ReturnType<typeof project>;

  const compose = (projectors: EventProject[]) => ({
    projectEvent: async <TEventType extends keyof TEventRegistry>(
      event: TEventRegistry[TEventType]
    ) => {
      await aroundProjection(async (ctx) => {
        for (const p of projectors.filter(
          (el) => el.eventType === event.type
        )) {
          await p.fn(ctx, event);
        }
      }, event);
      return event;
    },
  });

  return {
    project,
    compose,
  };
};
