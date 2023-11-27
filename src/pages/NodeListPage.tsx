import NodeList from '../components/NodeList'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { LOCAL_STORAGE_KEYS, getFromLocalStorage } from '../utils/LocalStorageUtils'

const NodeListPage = () => {
    const navigate = useNavigate()
    const { logout } = useAuth()

    function handleLogout() {
        logout()
        navigate('/login')
    }

    return (
        <div className="max-w-2xl mx-auto my-8 px-10">
            <p className="line-clamp-none">
                Hello <span className="font-bold">{getFromLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_EMAIL)}</span>
            </p>
            <hr className="my-4" />
            <NodeList />
            <hr className="my-4" />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleLogout}>
                Logout
            </button>
        </div>
    )
}

export default NodeListPage
