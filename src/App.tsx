import LoginForm from './LoginForm'
import ContentList from './ContentList'
import { useAuth } from './hooks/useAuth'

const App = () => {
    const { isAuthenticated } = useAuth()

    return <>{isAuthenticated ? <ContentList /> : <LoginForm />}</>
}

export default App
