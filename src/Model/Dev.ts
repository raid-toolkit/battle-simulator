import safeLocalStorage from '../Common/LocalStorage';

try {
  const initialParams = new URLSearchParams(document.location.search);
  const isDev = initialParams.get('dev');
  if (isDev !== null) {
    safeLocalStorage.setItem('dev', isDev ? 'true' : 'false');
  } else if (document.referrer) {
    const refUrl = new URL(document.referrer);
    if (refUrl.host.startsWith('local.')) {
      safeLocalStorage.setItem('dev', 'true');
    }
  }
} catch {}

export const isLocal = document.location.hostname.startsWith('local.');
export const isDev = safeLocalStorage.getItem('dev') === 'true';
