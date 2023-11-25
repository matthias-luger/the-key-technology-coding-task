import { Navigate, createBrowserRouter } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import NodeListPage from '../pages/NodeListPage'

export const router = createBrowserRouter([
    { path: '/login', Component: LoginPage },
    { path: '/nodes', Component: NodeListPage },
    { path: '*', Component: () => <Navigate to="/login" /> }
])
