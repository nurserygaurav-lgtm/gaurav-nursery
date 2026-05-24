const hasWindow = typeof window !== 'undefined';

function readStorage(storage, key) {
  if (!storage) return null;

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(storage, key, value) {
  if (!storage) return false;

  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function deleteStorage(storage, key) {
  if (!storage) return false;

  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function safeLocalStorageGet(key) {
  return hasWindow ? readStorage(window.localStorage, key) : null;
}

export function safeLocalStorageSet(key, value) {
  return hasWindow ? writeStorage(window.localStorage, key, value) : false;
}

export function safeLocalStorageRemove(key) {
  return hasWindow ? deleteStorage(window.localStorage, key) : false;
}

export function safeSessionStorageGet(key) {
  return hasWindow ? readStorage(window.sessionStorage, key) : null;
}

export function safeSessionStorageSet(key, value) {
  return hasWindow ? writeStorage(window.sessionStorage, key, value) : false;
}

export function safeSessionStorageRemove(key) {
  return hasWindow ? deleteStorage(window.sessionStorage, key) : false;
}

export function safeCustomEvent(name, detail) {
  if (!hasWindow || typeof window.CustomEvent !== 'function') return null;
  return new window.CustomEvent(name, { detail });
}

export function safeDispatchEvent(event) {
  if (!hasWindow || !event) return false;

  try {
    window.dispatchEvent(event);
    return true;
  } catch {
    return false;
  }
}
