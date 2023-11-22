import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ApolloProvider } from '@apollo/client'
import { AuthProvider } from './context/AuthContext.tsx'
import { client } from './utils/ApolloUtils.tsx'
import { RouterProvider } from 'react-router'
import { router } from './utils/Routes.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </ApolloProvider>
    </React.StrictMode>
)
