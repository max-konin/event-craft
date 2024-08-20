import { test, expect } from 'vitest';

import { buildEventEmitter } from './event-emitter';
import {
  OPEN_ACCOUNT,
  OpenAccountTestEvent,
  TestEventRegistry,
} from './test-utils';

const eventEmitter = buildEventEmitter<TestEventRegistry>();

const eventType = OPEN_ACCOUNT;
const event: OpenAccountTestEvent = {
  id: '123',
  type: eventType,
  data: { creditLimit: 100, aggregateId: '1' },
  aggregateVersion: 1n,
};

test('emitEvent should emit the event with the correct type', () => {
  let emittedEvent;

  eventEmitter.subscribeOn(eventType, (event) => {
    emittedEvent = event;
  });

  eventEmitter.emitEvent(event);

  expect(emittedEvent).toBe(event);
});

test('subscribeOn should register the event listener', () => {
  let receivedEvent;

  eventEmitter.subscribeOn(eventType, (event) => {
    receivedEvent = event;
  });

  eventEmitter.emitEvent(event);

  expect(receivedEvent).toBe(event);
});
