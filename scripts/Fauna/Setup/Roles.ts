import { Client, Expr, query as q } from 'faunadb';
import { TableName } from './Constants';
const {
  Select,
  Indexes,
  Collections,
  CreateRole,
  Paginate,
  Roles,
  Role,
  Lambda,
  Delete,
  Var,
  Collection,
  Index,
  If,
  Exists,
  Update,
  Union,
  Query,
  Let,
  CurrentIdentity,
  Equals,
  Get,
} = q;

export interface DBPrivilege {
  resource?: Expr;
  actions?: Partial<Record<'call' | 'create' | 'read' | 'write' | 'history_read' | 'delete', boolean | Expr>>;
}

export interface DBRole {
  name: string;
  membership?: any[];
  privileges?: Expr | DBPrivilege[];
}

// A convenience function to either create or update a role.
function CreateOrUpdateRole(obj: DBRole) {
  return If(
    Exists(Role(obj.name)),
    Update(Role(obj.name), { membership: obj.membership, privileges: obj.privileges }),
    CreateRole(obj)
  );
}

export const CreateBootstrapRole = CreateOrUpdateRole({
  name: 'keyrole_calludfs',
  privileges: [
    {
      resource: q.Function('get_team'),
      actions: {
        call: true,
      },
    },
  ],
});

export const CreateLoggedInRole = CreateOrUpdateRole({
  name: 'membershiprole_loggedin',
  privileges: [
    // these are all the User Defined Functions
    // that a logged in user can call. All our manipulations
    // are encapsulated in User Defined Functions which makes it easier
    // to limit what data and how a user can adapt data.
    {
      resource: q.Function('create_team'),
      actions: {
        call: true,
      },
    },
    {
      resource: q.Function('get_team'),
      actions: {
        call: true,
      },
    },
  ],
});

export const CreateFnRoleManipulateTeams = CreateOrUpdateRole({
  name: 'functionrole_manipulate_teams',
  privileges: [
    /** *********************** WRITE AND UPDATE PRIVILEGES *************************/
    // Of course the function needs to update a team
    {
      resource: Collection(TableName.Teams),
      actions: { create: true, write: true },
    },
    /** *********************** READ PRIVILEGES *************************/
    {
      resource: Collection(TableName.Teams),
      actions: { read: true },
    },
  ],
});

export const DeleteAllRoles = q.Map(Paginate(Roles()), Lambda('ref', Delete(Var('ref'))));
