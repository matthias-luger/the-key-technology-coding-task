import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getFromLocalStorage, LOCAL_STORAGE_KEYS } from './LocalStorageUtils'
import { persistCache } from 'apollo3-cache-persist'

const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URL
})

const authLink = setContext((_, { headers }) => {
    const token = getFromLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_JWT)

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const cache = new InMemoryCache()
persistCache({
    cache,
    storage: window.localStorage
})

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: cache
})
