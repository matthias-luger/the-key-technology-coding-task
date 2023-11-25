import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ApolloProvider } from '@apollo/client'
import { AuthProvider } from './context/AuthContext.tsx'
import { client } from './utils/ApolloUtils.tsx'
import { RouterProvider } from 'react-router'
import { router } from './utils/Routes.tsx'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <DndProvider backend={HTML5Backend}>
            <ApolloProvider client={client}>
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
            </ApolloProvider>
        </DndProvider>
    </React.StrictMode>
)
