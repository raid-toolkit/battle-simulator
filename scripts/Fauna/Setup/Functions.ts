import { Client, Expr, query as q } from 'faunadb';
import { TableName } from './Constants';
import { v4 } from 'uuid';

const {
  Create,
  Collection,
  Let,
  Var,
  Query,
  Lambda,
  Exists,
  If,
  Update,
  Select,
  Get,
  CreateFunction,
  Role,
  CurrentIdentity,
  Now,
  Ref,
} = q;

export interface DBFunction {
  name: string;
  body: Expr;
  role: Expr;
}

// A convenience function to either create or update a function.
function CreateOrUpdateFunction(obj: DBFunction) {
  return If(
    Exists(q.Function(obj.name)),
    Update(q.Function(obj.name), { body: obj.body, role: obj.role }),
    CreateFunction({ name: obj.name, body: obj.body, role: obj.role })
  );
}

// Example of an identity based rate-limiting function
// Of course this requires you to use UDFs since you do not want to give the end user
// access to:
//  - Creating the fweets without hitting rate limiting
//  - Changing the rate limiting.

function CreateTeam(name: Expr, savedTeam: Expr) {
  const FQLStatement = Create(Collection(TableName.Teams), {
    data: {
      id: v4(),
      name,
      savedTeam,
      author: CurrentIdentity(),
      // we will order by creation time, we already have 'ts' by default but updated will also update 'ts'.
      created: Now(),
    },
  });
  return FQLStatement;
}

export const CreateTeamUDF = CreateOrUpdateFunction({
  name: 'create_team',
  body: Query(Lambda(['name', 'savedTeam'], CreateTeam(Var('name'), Var('savedTeam')))),
  role: Role('functionrole_manipulate_teams'),
});

export const GetTeamUDF = CreateOrUpdateFunction({
  name: 'get_team',
  body: Query(
    Lambda(
      'teamId',
      Let(
        {
          teamDoc: Get(Ref(Collection(TableName.Teams), Var('teamId'))),
        },
        {
          id: Select(['data', 'id'], Var('teamDoc')),
          name: Select(['data', 'name'], Var('teamDoc')),
          savedTeam: Select(['data', 'savedTeam'], Var('teamDoc')),
          author: Select(['data', 'author'], Var('teamDoc')),
        }
      )
    )
  ),
  role: Role('functionrole_manipulate_teams'),
});
