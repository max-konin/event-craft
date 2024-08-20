import { Either, mapLeft } from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/function';
import {
  Do,
  apS,
  bindW,
  tryCatchK,
  tryCatch,
  map,
  fromEither,
  chainW,
} from 'fp-ts/TaskEither';
import { ZodError, z } from 'zod';

import { EventEmitter } from './event-emitter';
import { EventRegistryBase } from './event-registry';
import { Projector } from './projector';

export type CommandDataBase = {
  aggregateId: string;
};

export const VALIDATION_ERROR = 'VALIDATION_ERROR' as const;
export const LOADING_STATE_ERROR = 'LOADING_STATE_ERROR' as const;

export class CommandValidationError extends Error {
  constructor(public readonly zodError: ZodError) {
    super(`COMMAND_VALIDATION_ERROR ${zodError.toString()}`);
  }
}

const constructCommand = <
  TCommandType extends string,
  TSchema extends z.ZodTypeAny,
>(
  type: TCommandType,
  schema: TSchema
) =>
  tryCatchK(
    async (input: z.infer<TSchema>) => {
      const res = await schema.safeParseAsync(input);
      return res.success
        ? {
            type,
            data: res.data as z.infer<TSchema>,
          }
        : Promise.reject(new CommandValidationError(res.error));
    },
    (error) => error as CommandValidationError
  );

export type Command<
  TCommandType extends string,
  TSchema extends z.ZodTypeAny,
> = {
  type: TCommandType;
  data: z.infer<TSchema>;
};

export type ExecutionContext<
  TCommandType extends string,
  TSchema extends z.ZodTypeAny,
  TState,
> = {
  cmd: Command<TCommandType, TSchema>;
  state: TState;
};

export type ExecutionResponseBase<TEventRegistry extends EventRegistryBase> =
  Either<string | never, TEventRegistry[string]>;

export type CommandDef<
  TCommandType extends string,
  TSchema extends z.ZodTypeAny,
> = {
  schema: TSchema;
  type: TCommandType;
};

export type CommandModule<
  TEventRegistry extends EventRegistryBase,
  TCommandType extends string,
  TSchema extends z.ZodTypeAny,
  TState,
  TExecutionResponse extends ExecutionResponseBase<TEventRegistry>,
> = CommandDef<TCommandType, TSchema> & {
  execute: (
    ctx: ExecutionContext<TCommandType, TSchema, TState>
  ) => TExecutionResponse;
};

export type DispatchCommandArgs<
  TEventRegistry extends EventRegistryBase,
  TCommandType extends string,
  TSchema extends z.ZodTypeAny,
  TState,
  TExecutionResponse extends ExecutionResponseBase<TEventRegistry>,
> = {
  commandModule: CommandModule<
    TEventRegistry,
    TCommandType,
    TSchema,
    TState,
    TExecutionResponse
  >;
  stateLoader: (aggregateId: string) => Promise<TState>;
  projector?: Projector<TEventRegistry>;
};

export class LoadingStateError extends Error {
  constructor() {
    super('LOADING_STATE_ERROR');
  }
}

export class CommandExecutionError extends Error {
  constructor(public readonly reason?: string) {
    super('COMMAND_EXECUTION_ERROR');
  }
}

export const buildCommandedApp = <TEventRegistry extends EventRegistryBase>(
  eventEmitter: EventEmitter
) => ({
  bindExecution:
    <
      TCommandType extends string,
      TSchema extends z.ZodTypeAny,
      TState,
      TExecutionResponse extends ExecutionResponseBase<TEventRegistry>,
    >(
      execute: (
        state: TState,
        cmd: Command<TCommandType, TSchema>
      ) => TExecutionResponse
    ) =>
    (
      commandDef: CommandDef<TCommandType, TSchema>
    ): CommandModule<
      TEventRegistry,
      TCommandType,
      TSchema,
      TState,
      TExecutionResponse
    > => ({
      ...commandDef,
      execute: ({
        state,
        cmd,
      }: ExecutionContext<TCommandType, TSchema, TState>) =>
        execute(state, cmd),
    }),

  dispatchCommand:
    <
      TCommandType extends string,
      TSchema extends z.ZodTypeAny,
      TState,
      TExecutionResponse extends ExecutionResponseBase<TEventRegistry>,
    >({
      commandModule: { type, schema, execute },
      stateLoader,
      projector,
    }: DispatchCommandArgs<
      TEventRegistry,
      TCommandType,
      TSchema,
      TState,
      TExecutionResponse
    >) =>
    (input: z.infer<TSchema>) =>
      pipe(
        Do,
        apS('cmd', constructCommand(type, schema)(input)),
        bindW(
          'state',
          tryCatchK(
            ({ cmd }) => stateLoader(cmd.data.aggregateId),
            () => new LoadingStateError()
          )
        ),
        map(
          flow(
            execute,
            mapLeft((e) => new CommandExecutionError(e))
          )
        ),
        chainW(fromEither),
        chainW((event) =>
          tryCatch(
            () =>
              projector
                ? projector.projectEvent(event)
                : Promise.resolve(event),
            String
          )
        ),
        chainW((event) => tryCatch(() => eventEmitter.emitEvent(event), String))
      ),
});
