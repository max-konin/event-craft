import { prisma } from '../../../db';

export const findAllAccounts = () => prisma.account.findMany();
