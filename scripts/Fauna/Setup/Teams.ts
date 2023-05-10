import { Client, Expr, query as q } from 'faunadb';
import { TableName } from './Constants';

const { Select, Get } = q;

const {
  CreateCollection,
  Collection,
  Exists,
  If,
  Delete,
  LT,
  Var,
  Foreach,
  Paginate,
  Documents,
  Lambda,
  Do,
  Update,
  Concat,
} = q;

interface DBCollection {
  name: string;
  version: number;
  upgrades: Record<number, Expr>;
}

function createOrUpgradeCollection({ name, version, upgrades }: DBCollection) {
  return If(
    Exists(Collection(name)),
    If(
      LT(Select(['data', 'version'], Get(Collection(name)), 0), version),
      Do(
        Object.entries(upgrades).map(([version, upgrade]) =>
          If(LT(Select(['data', 'version'], Get(Collection(name)), 0), version), upgrade, false)
        ),
        Update(Collection(name), { data: { version } })
      ),
      false
    ),
    CreateCollection({ name, data: { version } })
  );
}

export async function createSavedTeamsCollection(client: Client) {
  const query = createOrUpgradeCollection({
    name: TableName.Teams,
    version: 4,
    upgrades: {
      4: Foreach(
        Paginate(Documents(Collection(TableName.Teams))),
        Lambda('ref', Update(Var('ref'), { data: { id: Concat([Select(['id'], Var('ref'))], '_') } }))
      ),
    },
  });
  const result = await client.query(query);
  console.log({ query: query.toFQL(), result });
}

// If you delete a collection/index you have to wait 60 secs before the
// names go out of the cache before you reuse them.
export async function deleteSavedTeamsCollection(client: Client) {
  await client.query(If(Exists(Collection(TableName.Teams)), true, Delete(Collection(TableName.Teams))));
}
