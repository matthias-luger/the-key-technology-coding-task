import { FormEvent, useState } from 'react'
import { ApolloError } from '@apollo/client'
import { useAuth } from './hooks/useAuth'

const LoginForm = () => {
    const { login } = useAuth()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>()

    const handleLogin = (e: FormEvent) => {
        setLoading(true)
        e.preventDefault()
        login(email, password)
            .then(() => {
                console.log('successfully logged in')
            })
            .catch((error: ApolloError) => {
                if (error.message === 'auth_login_with_email_and_password_unspecified_auth') {
                    setError('Wrong username or password!')
                } else {
                    setError(error.message)
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <form onSubmit={handleLogin} className="max-w-md mx-auto my-8">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Username:
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                    id="username"
                    type="text"
                    placeholder="Username"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password:
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                    id="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <button
                disabled={loading}
                className={`${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded`}
                type="submit"
            >
                Login
            </button>
            {error ? (
                <>
                    <hr className="my-4" />
                    <p className="text-red-500">Failed to login:</p>
                    <p className="text-red-500 font-bold">{error}</p>
                </>
            ) : null}
        </form>
    )
}

export default LoginForm
