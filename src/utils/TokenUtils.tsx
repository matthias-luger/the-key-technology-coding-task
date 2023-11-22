import { LOCAL_STORAGE_KEYS, getFromLocalStorage } from './LocalStorageUtils'

export function isValidTokenAvailable(): boolean {
    const token = getFromLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_JWT)
    if (!token) {
        return false
    }
    try {
        const parsedToken = JSON.parse(atob(token.split('.')[1]))
        const expirationDate = new Date(parsedToken.exp * 1000)

        // check if token is expired (add 10 seconds for buffer)
        return expirationDate.getTime() > new Date().getTime() + 10000
    } catch {
        return false
    }
}
