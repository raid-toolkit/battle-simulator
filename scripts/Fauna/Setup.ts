import fs from 'fs';
import * as envfile from 'envfile';
import FaunaDB from 'faunadb';
import { handleSetupError } from './Helpers';
import { withDB, envPath } from './Wrapper';

const { setupDatabase } = require('./Setup/Database');

const clientKeyMessage = `The client token to bootstrap your application. 
will be automatically installed in the ${envPath} with the key REACT_APP_BOOTSTRAP_FAUNADB_KEY, react will load the .env vars
Don't forget to restart your frontend!`;

const q = FaunaDB.query;
const { CreateKey, Role } = q;

withDB(async (client) => {
  await setupDatabase(client);

  console.log('6.  -- Keys                    -- Bootstrap key to start the app');

  console.log('\x1b[32m', clientKeyMessage);
  let json: any = null;
  try {
    json = envfile.parse(fs.readFileSync(envPath, 'utf8'));
  } catch (err) {
    json = {};
  }
  if (!json.REACT_APP_BOOTSTRAP_FAUNADB_KEY) {
    const clientKey = await handleSetupError<any>(
      client.query(CreateKey({ role: Role('keyrole_calludfs') })),
      'token - bootstrap'
    );
    json.REACT_APP_BOOTSTRAP_FAUNADB_KEY = clientKey.secret;
    fs.writeFileSync(envPath, envfile.stringify(json));
  }
  console.log('\x1b[33m%s\x1b[0m', json.REACT_APP_BOOTSTRAP_FAUNADB_KEY);
});
