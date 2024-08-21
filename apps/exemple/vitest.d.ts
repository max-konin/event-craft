/* eslint-disable no-unused-vars */
import type { Assertion, AsymmetricMatchersContaining } from 'vitest'
import type { EitherMatchersType} from '@event-craft/vitest-either-matchers'

declare module 'vitest' {
  interface Assertion<T = any> extends EitherMatchersType<T> {}
  interface AsymmetricMatchersContaining extends EitherMatchersType {}
}