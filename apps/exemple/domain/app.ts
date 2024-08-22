import {
  buildCommandDispatcher,
  buildEventEmitter,
  buildProjector,
} from '@event-craft/core';
import { EventRegistry } from './event-registry';
import { prisma } from '../db';

import { PrismaClient } from '@prisma/client';
import { ITXClientDenyList } from '@prisma/client/runtime/library';

export type PrismaTransaction = Omit<PrismaClient, ITXClientDenyList>;

export const eventEmitter = buildEventEmitter<EventRegistry>();

export const { dispatchCommand, bindExecution } =
  buildCommandDispatcher<EventRegistry>(eventEmitter);

export const { project, compose } = buildProjector<
  EventRegistry,
  PrismaTransaction
>((fn, { id, data, aggregateVersion, type }) =>
  prisma.$transaction(async (tx) => {
    await fn(tx);
    await prisma.domainEvent.create({
      data: {
        id,
        data,
        type,
        aggregateVersion,
        aggregateId: data.aggregateId,
      },
    });
  })
);
