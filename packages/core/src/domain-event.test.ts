import { describe, it, expect } from 'vitest';
import { buildEvent } from './domain-event.js';

describe('buildEvent', () => {
   const event = buildEvent({
     type: 'TEST_EVENT',
     data: { aggregateId: '1' },
     aggregateVersion: 1n,
   });
  it('should generate an event with a unique ID', () => {
    expect(event.id).toBeDefined();
    expect(typeof event.id).toBe('string');
  });

  it('should set the provided event properties correctly', () => {
    expect(event.type).toBe('TEST_EVENT');
    expect(event.data).toEqual({ aggregateId: '1' });
    expect(event.aggregateVersion).toBe(1n);
  });
});