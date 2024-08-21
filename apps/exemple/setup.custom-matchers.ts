import { expect } from 'vitest';
import { toMatchLeft, toMatchRight } from '@event-craft/vitest-either-matchers';

expect.extend({
  toMatchLeft,
  toMatchRight,
});
