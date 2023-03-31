import { Expr, query as q } from 'faunadb';

const {
  CreateAccessProvider,
  Paginate,
  Role,
  Lambda,
  Delete,
  Var,
  If,
  Exists,
  Update,
  AccessProvider,
  AccessProviders,
} = q;

export interface DBAccessProvider {
  name: string;
  issuer: string;
  jwks_uri: string;
  roles: Expr[];
}

function CreateOrUpdateAccessProvider(obj: DBAccessProvider) {
  const { name, ...props } = obj;
  return If(Exists(AccessProvider(obj.name)), Update(AccessProvider(obj.name), props), CreateAccessProvider(obj));
}

export const CreateClerkAccessProvider = CreateOrUpdateAccessProvider({
  name: 'Clerk',
  issuer: process.env.FAUNA_ISSUER!,
  jwks_uri: `${process.env.FAUNA_ISSUER!}/.well-known/jwks.json`,
  roles: [Role('membershiprole_loggedin')],
});

export const DeleteAllAccessProviders = q.Map(Paginate(AccessProviders()), Lambda('ref', Delete(Var('ref'))));
