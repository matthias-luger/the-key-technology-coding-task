import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getFromLocalStorage, LOCAL_STORAGE_KEYS } from './LocalStorageUtils'

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

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})
