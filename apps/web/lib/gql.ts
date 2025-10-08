'use client';
import { GraphQLClient } from 'graphql-request';
import Cookies from 'js-cookie';

const endpoint = process.env.API_URL ?? 'http://localhost:3000/graphql';

export function client() {
  const token = Cookies.get('token');
  return new GraphQLClient(endpoint, {
    headers: token ? { authorization: `Bearer ${token}` } : {},
    credentials: 'include',
  });
}

export async function gqlLogin(email: string, password: string): Promise<string> {
  const c = client();
  const query = `
    mutation($email:String!, $password:String!) {
      login(email:$email, password:$password)
    }
  `;
  const res = await c.request<{ login: string }>(query, { email, password });
  return res.login;
}

export type TxEdge = {
  cursor: string;
  node: {
    id: string; 
    amountCents: number; 
    currency: string; 
    status: string; 
    createdAt: string;
  };
};

export async function gqlTransactions(first = 20, after?: string) {
  const c = client();
  const query = `
    query($first:Int,$after:String){
      transactions(first:$first, after:$after){
        edges{ cursor node{ id amountCents currency status createdAt } }
        pageInfo{ endCursor hasNextPage }
      }
    }
  `;
  return c.request<{
    transactions: { edges: TxEdge[]; pageInfo: { endCursor?: string | null; hasNextPage: boolean } };
  }>(query, { first, after });
}
