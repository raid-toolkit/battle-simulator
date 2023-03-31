import { Client, query as q } from 'faunadb';
import { handleSetupError } from '../Helpers';
import { CreateClerkAccessProvider } from './AccessProviders';
import { CreateTeamUDF, GetTeamUDF } from './Functions';
import { CreateBootstrapRole, CreateFnRoleManipulateTeams, CreateLoggedInRole } from './Roles';
import { createSavedTeamsCollection } from './Teams';

export async function setupDatabase(client: Client) {
  console.log('1.  -- Collections and Indexes -- Creating collections');
  await handleSetupError(createSavedTeamsCollection(client), 'saved teams collection');

  console.log('4a. -- Roles                   -- Creating security roles to be assumed by the functions');
  await handleSetupError(client.query(CreateFnRoleManipulateTeams), 'function role - create manipulate teams');

  console.log('5.  -- Functions               -- Creating User Defined Functions (UDF)');
  await handleSetupError(client.query(CreateTeamUDF), 'user defined function - create_team');
  await handleSetupError(client.query(GetTeamUDF), 'user defined function - get_team');

  console.log('4b. -- Roles                   -- Creating security role that can call the functions');
  await handleSetupError(client.query(CreateBootstrapRole), 'function role - bootstrap');

  console.log('4c. -- Roles                   -- Give logged in accounts access to their data');
  await handleSetupError(client.query(CreateLoggedInRole), 'membership role - logged in role');
  await handleSetupError(client.query(CreateClerkAccessProvider), 'access provider - clerk - logged in role');
}
