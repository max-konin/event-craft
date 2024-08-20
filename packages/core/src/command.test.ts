import { right } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { matchW } from 'fp-ts/lib/TaskEither';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';

import {
  CommandValidationError,
  LoadingStateError,
  buildCommandedApp,
} from './command';
import { buildEventEmitter } from './event-emitter';
import { TestEventRegistry } from './test-utils';

const { bindExecution, dispatchCommand } =
  buildCommandedApp<TestEventRegistry>(buildEventEmitter());

describe('Base | Command', () => {
  describe('.dispatchCommand', () => {
    const schema = z.object({
      email: z.string(),
    });
    const testCommandType = 'TEST_COMMAND' as const;

    const event = {
      id: 'eventId',
      data: {},
      aggregateId: '1',
      aggregateVersion: 1n,
      type: 'TEST_EVENT',
    };

    const testCommandModule = pipe(
      {
        schema,
        type: testCommandType,
      },
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      bindExecution((_state: null, _cmd) => right(event))
    );

    const stateLoader = vi.fn();

    const projector = {
      projectEvent: vi
        .fn()
        .mockImplementation((event: unknown) => Promise.resolve(event)),
    };

    const input = { email: 'user' };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subject = (input: any) =>
      pipe(
        input,
        dispatchCommand({
          stateLoader,
          commandModule: testCommandModule,
          projector: projector,
        }),
        matchW(
          (error) => ({ ok: false, error }),
          (event) => ({ ok: true, event })
        )
      )();

    describe('when state loader returns a correct state', () => {
      beforeEach(() => {
        stateLoader.mockResolvedValue(null);
      });
      describe('when data is valid', async () => {
        it('should return right Either with data', async () => {
          expect(await subject(input)).toEqual({ ok: true, event });
        });
        it('should call the projector', async () => {
          await subject(input);
          expect(projector.projectEvent).toHaveBeenCalledWith(event);
        });
      });

      describe('when data is not valid', async () => {
        it('should return left Either with error', async () => {
          expect(await subject({})).toEqual({
            ok: false,
            error: expect.any(CommandValidationError),
          });
        });
      });
    });

    describe('when state loader returns an error', () => {
      beforeEach(() => {
        stateLoader.mockRejectedValue(null);
      });

      it('should return left Either with error', async () => {
        expect(await subject(input)).toEqual({
          ok: false,
          error: expect.any(LoadingStateError),
        });
      });
    });
  });
});
