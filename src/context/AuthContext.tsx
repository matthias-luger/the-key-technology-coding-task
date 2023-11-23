import { PropsWithChildren, createContext, useState } from 'react'
import { ApolloError, FetchResult, useMutation } from '@apollo/client'
import { LOCAL_STORAGE_KEYS, removeFromLocalStorage, setIntoLocalStorage } from '../utils/LocalStorageUtils'
import { isValidTokenAvailable } from '../utils/TokenUtils'
import { LOGIN_MUTATION } from '../utils/Queries'

interface AuthState {
    isAuthenticated: boolean
    jwtToken: string | null
}

export interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}

interface AuthResult {
    Auth: {
        loginJwt: {
            jwtTokens: {
                accessToken: string
            }
        }
    }
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [state, setState] = useState<AuthState>({
        isAuthenticated: isValidTokenAvailable(),
        jwtToken: null
    })
    const [loginMutation] = useMutation(LOGIN_MUTATION)

    function login(email: string, password: string): Promise<void> {
        return new Promise((resolve, reject) => {
            loginMutation({
                variables: {
                    input: {
                        email: email,
                        password: password
                    }
                }
            })
                .then((result: FetchResult<AuthResult>) => {
                    const token = result.data?.Auth.loginJwt.jwtTokens.accessToken
                    if (token) {
                        setIntoLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_JWT, token)
                        setState({
                            isAuthenticated: true,
                            jwtToken: token
                        })
                        resolve()
                    }
                    reject('No token returned')
                })
                .catch((error: ApolloError) => {
                    reject(error)
                })
        })
    }

    function logout() {
        removeFromLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_JWT)
        setState({
            isAuthenticated: false,
            jwtToken: null
        })
    }

    const contextValue: AuthContextType = {
        ...state,
        login,
        logout
    }

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
