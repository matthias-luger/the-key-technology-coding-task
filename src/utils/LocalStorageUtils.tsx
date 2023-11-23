export enum LOCAL_STORAGE_KEYS {
    LOGIN_JWT = 'loginJwt',
    LOGIN_EMAIL = 'loginEmail'
}

export function getFromLocalStorage(key: LOCAL_STORAGE_KEYS) {
    return localStorage.getItem(key)
}

export function setIntoLocalStorage(key: LOCAL_STORAGE_KEYS, value: string) {
    return localStorage.setItem(key, value)
}

export function removeFromLocalStorage(key: LOCAL_STORAGE_KEYS) {
    return localStorage.removeItem(key)
}
