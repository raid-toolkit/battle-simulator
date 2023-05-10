import { Client, query as q } from 'faunadb';
import type FaunaDB from 'faunadb';

const { Collection, Var, Lambda, Get, Map, Documents, Paginate } = q;

export async function backupDocuments(client: Client) {
  const query = Map(Paginate(Documents(Collection('teams'))), Lambda(['ref'], Get(Var('ref'))));
  const results: { data: FaunaDB.values.Document[] } = await client.query(query);
  const updatedData = results.data.map(({ ref: { id }, data }) => ({ ...data, id }));
  console.log(updatedData);
}
