import { prisma } from '../../../db';

export const findAccountById = (accountId: string) =>
  prisma.account.findUnique({ where: { id: accountId } });

export type AccountOrNull = Awaited<ReturnType<typeof findAccountById>>;
