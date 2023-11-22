import { createBrowserRouter } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import NodeListPage from '../pages/NodeListPage'

export const router = createBrowserRouter([
    { path: '/', Component: LoginPage },
    { path: '/nodes', Component: NodeListPage },
    { path: '*', Component: null }
])
