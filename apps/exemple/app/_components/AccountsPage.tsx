'use client';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Container,
  Heading,
  Button,
  VStack,
} from '@chakra-ui/react';
import { findAllAccounts } from '../../domain/account';
import { createAccount } from '../actions';

type AccountsTableProps = {
  accounts: Awaited<ReturnType<typeof findAllAccounts>>;
};

export const AccountsPage = ({ accounts }: AccountsTableProps) => (
  <Container>
    <VStack spacing={4}>
      <Heading>Accounts</Heading>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Balance</Th>
            </Tr>
          </Thead>
          <Tbody>
            {accounts.map((account) => (
              <Tr key={account.id}>
                <Td>{account.id}</Td>
                <Td>{account.balance.toString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Button onClick={() => createAccount()}>Create Account</Button>
    </VStack>
  </Container>
);
