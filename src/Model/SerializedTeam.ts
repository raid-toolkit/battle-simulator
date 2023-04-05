import { pack, unpack } from 'jsonpack';
import { TuneState } from './AppState';

export function serializeTeam(team: TuneState): string {
  return btoa(pack(team));
}

export function getSerializedTeamUrl(state: TuneState): string {
  const url = new URL(document.location.href);
  const qs = new URLSearchParams();
  const packed = serializeTeam(state);
  qs.set('ts', packed);
  url.hash = '';
  url.search = qs.toString();
  return url.toString();
}

export function deserializeTeam(serialized: string): TuneState {
  return unpack<TuneState>(atob(serialized));
}
