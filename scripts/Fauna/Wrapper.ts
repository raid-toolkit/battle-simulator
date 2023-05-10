import dotenv from 'dotenv';
import FaunaDB from 'faunadb';
import { handleSetupError } from './Helpers';
const readline = require('readline-promise').default;

export const envPath = `.env${process.argv[2] ? `.${process.argv[2]}` : ''}`;
dotenv.config({ path: envPath });

const q = FaunaDB.query;
const { CreateKey, Database } = q;

const keyQuestion = `----- 1. Please provide a FaunaDB admin key) -----
You can get one on https://dashboard.fauna.com/ on the Security tab of the database you want to use.

An admin key is powerful, it should only be used for the setup script, not to run your application!
At the end of the script a key with limited privileges will be returned that should be used to run your application
Enter your key or set it .env.local as 'FAUNA_ADMIN' (do not push this to git):`;

const explanation = `
Thanks!
This script will (Do not worry! It will all do this for you): 
 - Setup the user defined functions 'login and register'
 - Create roles that the user defined functions will assume
 - Create a role for the initial key which can only call login/register
 - Create a role for an account to assume (database entities can assume roles, using Login a key can be retrieved for such an entity)
(take a look at scripts/setup.js if it interests you what it does)
`;

export interface WithDBOptions {
  selectTopLevelDB?: boolean;
}

export async function withDB(callback: (client: FaunaDB.Client) => Promise<void>, opts: WithDBOptions = {}) {
  opts = Object.assign({ selectTopLevelDB: false }, opts);

  // In order to set up a database, we need a admin key
  let adminKey = process.env.FAUNA_ADMIN;

  // If this option is provided, the db will be created as a child db of the database
  // that the above admin key belongs to. This is useful to destroy/recreate a database
  // easily without having to wait for cache invalidation of collection/index names.
  const childDbName = process.env.FAUNA_CHILD_DB_NAME;

  // Ask the user for a key if it's not provided in the environment variables yet.
  if (!adminKey) {
    const interactiveSession = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    await interactiveSession.questionAsync(keyQuestion).then((key: string) => {
      adminKey = key;
      interactiveSession.close();
    });
    console.log(explanation);
  }
  let client = new FaunaDB.Client({ secret: adminKey! });

  if (!opts.selectTopLevelDB) {
    let key: any = undefined;
    if (typeof childDbName !== 'undefined' && childDbName !== '') {
      key = await handleSetupError<any>(
        client.query(CreateKey({ database: Database(childDbName), role: 'admin' })),
        'Admin key - child db'
      );
      if (!key) {
        throw new Error('Key not defined');
      }
      client = new FaunaDB.Client({ secret: key.secret });
    }
  }

  try {
    await callback(client);
  } catch (err) {
    console.error('Unexpected error', err);
  } finally {
  }
}
