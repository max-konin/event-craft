# Event Craft

**Event Craft** is a Node.js package designed for building domain logic using modern patterns like CQRS, and Railway Oriented Programming, and simple implementation of Event Sourcing. This package aims to simplify the management of complex business logic in distributed systems. The core concept is to use Either from fp-ts package to describe business rules.

## Installation

Install the package using `pnpm`:

```bash
pnpm install @event-craft/core
```

## Usage

Simple command module:

```typescript
import { left, right } from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import { z } from 'zod';
import { buildEvent } from '@event-craft/core';

export const createAccountInputSchema = z.object({
  aggregateId: z.string(),
});

export type CreateAccountInput = z.infer<typeof createAccountInputSchema>;

export type AccountCreatedEventData = CreateAccountInput;

export const buildAccountCreatedEvent = (
  data: AccountCreatedEventData,
  aggregateVersion: bigint
) =>
  buildEvent({
    type: ACCOUNT_CREATED_EVENT_TYPE,
    data,
    aggregateVersion,
  });

export type AccountCreatedEvent = ReturnType<typeof buildAccountCreatedEvent>;

export const CreateAccountCommand = pipe(
  {
    type: 'CREATE_ACCOUNT_COMMAND' as const,
    schema: createAccountInputSchema,
  },
  bindExecution((account: AccountOrNull, { data }) => {
    if (account) {
      return left('Account already exists');
    }

    return right(buildAccountCreatedEvent(data, BigInt(1)));
  })
);
```

## Example Project

A full example project is available in the apps/example directory. You can run the example by navigating to the root of the repository and using the following commands:

pnpm install
pnpm run

## Contributing

Feel free to contribute by opening issues, suggesting features, or submitting pull requests.

## License

This project is licensed under the MIT License.
