import dotenv from 'dotenv';
import fs from 'fs';
import * as envfile from 'envfile';
import FaunaDB from 'faunadb';
import { handleSetupError } from './Helpers';
const readline = require('readline-promise').default;

const envPath = `.env${process.argv[2] ? `.${process.argv[2]}` : ''}`;
dotenv.config({ path: envPath });

const { setupDatabase } = require('./Setup/Database');

const sourcePath = '.env.local';
const sourcePathExample = '.env.local.example';
// This script sets up the database to be used for this example application.
// Look at the code in src/fauna/setup/.. to see what is behind the magic

const q = FaunaDB.query;
const { CreateKey, Role, Exists, Database, CreateDatabase, If } = q;

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

const main = async () => {
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

  if (typeof childDbName !== 'undefined' && childDbName !== '') {
    await handleSetupError(client.query(CreateDatabase({ name: childDbName })), 'database - create child database');
    const key = await handleSetupError<any>(
      client.query(CreateKey({ database: Database(childDbName), role: 'admin' })),
      'Admin key - child db'
    );
    if (!key) {
      throw new Error('Key not defined');
    }
    client = new FaunaDB.Client({ secret: key.secret });
  }

  try {
    await setupDatabase(client);

    console.log('6.  -- Keys                    -- Bootstrap key to start the app');

    const clientKey = await handleSetupError<any>(
      client.query(CreateKey({ role: Role('keyrole_calludfs') })),
      'token - bootstrap'
    );
    if (clientKey) {
      console.log(
        '\x1b[32m',
        `The client token to bootstrap your application. 
will be automatically installed in  the .env.local with the key REACT_APP_BOOTSTRAP_FAUNADB_KEY, react will load the .env vars
Don't forget to restart your frontend!`
      );
      let json: any = null;
      try {
        json = envfile.parse(fs.readFileSync(sourcePath, 'utf8'));
      } catch (err) {
        json = envfile.parse(fs.readFileSync(sourcePathExample, 'utf8'));
      }
      json.REACT_APP_BOOTSTRAP_FAUNADB_KEY = clientKey.secret;
      fs.writeFileSync(sourcePath, envfile.stringify(json));
      console.log('\x1b[33m%s\x1b[0m', clientKey.secret);
    }
  } catch (err) {
    console.error('Unexpected error', err);
  }
};

main();
