import { Either, match } from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import { equals } from '@vitest/expect';

export type EitherMatchersType<T = unknown, R = unknown> = {
  toMatchLeft: (r: T) => R;
  toMatchRight: (r: T) => R;
};

export const toMatchLeft = <TLeft, TRight>(
  received: Either<TLeft, TRight>,
  expected: TLeft
) =>
  pipe(
    received,
    match(
      (res) => ({
        pass: equals(res, expected),
        message: () => `Received ${jsonStringify(res)}, expected: ${expected}`,
      }),
      () => ({ pass: false, message: () => 'Either is right' })
    )
  );

export const toMatchRight = <TLeft, TRight>(
  received: Either<TLeft, TRight>,
  expected: TRight
) =>
  pipe(
    received,
    match(
      () => ({ pass: false, message: () => 'Either is left' }),
      (res) => ({
        pass: equals(res, expected),
        message: () => `Received ${jsonStringify(res)}, expected: ${expected}`,
      })
    )
  );

const jsonStringify = <T>(record: T) =>
  JSON.stringify(record, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
