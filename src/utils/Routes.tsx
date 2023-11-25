import { Navigate, createBrowserRouter } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import NodeListPage from '../pages/NodeListPage'
import NotFoundPage from '../pages/NotFoundPage'

export const router = createBrowserRouter([
    { path: '/', Component: () => <Navigate to="/login" /> },
    { path: '/login', Component: LoginPage },
    { path: '/nodes', Component: NodeListPage },
    { path: '*', Component: () => <NotFoundPage /> }
])
