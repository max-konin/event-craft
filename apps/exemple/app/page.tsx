import { findAllAccounts } from '../domain/account';

import { AccountsPage } from './_components/AccountsPage';

export default async function Home() {
  const accounts = await findAllAccounts();
  return <AccountsPage accounts={accounts} />;
}
