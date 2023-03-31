import { Client, query as q } from 'faunadb';
import { TableName } from './Constants';

const { CreateCollection, Collection, Exists, If, Delete } = q;

const CreateSavedTeamsCollection = CreateCollection({ name: TableName.Teams });

export async function createSavedTeamsCollection(client: Client) {
  await client.query(If(Exists(Collection(TableName.Teams)), true, CreateSavedTeamsCollection));
}

// If you delete a collection/index you have to wait 60 secs before the
// names go out of the cache before you reuse them.
export async function deleteSavedTeamsCollection(client: Client) {
  await client.query(If(Exists(Collection(TableName.Teams)), true, Delete(Collection(TableName.Teams))));
}
