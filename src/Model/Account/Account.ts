import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import faunadb, { query as q } from 'faunadb';
import { unpack } from 'jsonpack';
import { AccountModel, SavedTeamDocument } from '../Types';
import { TuneState, useAppModel } from '../AppState';

export function useAccountModel(): AccountModel {
  const { userId, getToken } = useAuth();
  const { dispatch } = useAppModel();
  const hasLoadedOnce = React.useRef(false);

  const getTeam = React.useCallback(async function getTeam(id: string): Promise<SavedTeamDocument> {
    const client = new faunadb.Client({
      secret: process.env.REACT_APP_LOCAL___BOOTSTRAP_FAUNADB_KEY!,
      keepAlive: false,
    });
    const result = await client.query<SavedTeamDocument>(q.Call(q.Function('get_team'), id));
    return result;
  }, []);

  const createTeam = React.useCallback(
    async function createTeam(name: string, savedTeam: TuneState): Promise<string> {
      const secret = (await getToken({ template: 'fauna' }))!;
      const client = new faunadb.Client({ secret, keepAlive: false });
      const document = await client.query<faunadb.values.Document>(q.Call(q.Function('create_team'), name, savedTeam));
      return document.ref.id;
    },
    [getToken]
  );

  React.useEffect(() => {
    try {
      if (hasLoadedOnce.current) return;

      hasLoadedOnce.current = true;
      const queryString = new URLSearchParams(document.location.search);
      const savedState = queryString.get('ts');
      if (savedState) {
        const unpacked = unpack<TuneState>(atob(savedState));
        dispatch.importTune(unpacked);
        return;
      }
      const tuneId = queryString.get('id');
      if (tuneId) {
        getTeam(tuneId).then((tune) => {
          dispatch.importTune(tune.savedTeam);
        });
      }
    } catch {}
  }, [dispatch, getTeam]);

  if (!userId) {
    return { getTeam };
  }

  return { userId, getTeam, createTeam };
}
