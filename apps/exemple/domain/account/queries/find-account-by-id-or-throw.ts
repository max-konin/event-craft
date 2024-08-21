import { prisma } from '../../../db';

export const findAccountByIdOrThrow = (id: string) =>
  prisma.account.findUniqueOrThrow({
    where: { id },
  });

export type Account = Awaited<ReturnType<typeof findAccountByIdOrThrow>>;
