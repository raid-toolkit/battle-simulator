import { backupDocuments } from './Setup/Data';
import { withDB } from './Wrapper';

withDB(async (client) => {
  backupDocuments(client);
});
