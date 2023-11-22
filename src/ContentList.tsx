/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@apollo/client'
import { GET_CONTENT_NODES_QUERY } from './utils/Queries'
import { useAuth } from './hooks/useAuth'

const ContentList = () => {
    const { logout } = useAuth()
    const { loading, error, data } = useQuery(GET_CONTENT_NODES_QUERY)

    const handleLogout = () => {
        logout()
    }

    const contentNodes = data ? data.Admin.Tree.GetContentNodes.edges : []

    return (
        <div className="max-w-md mx-auto my-8">
            {loading ? (
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-4 border-blue-500 border-solid mb-4"></div>
                    <p className="text-gray-600">Loading nodes...</p>
                </div>
            ) : (
                <>
                    <h2 className="text-2xl font-bold mb-4">Content Nodes</h2>
                    <div className="h-80 overflow-y-scroll">
                        <ul className="list-none pl-4 divide-y divide-gray-100">
                            {contentNodes.map((node: any, index: number) => (
                                <li key={index} className="py-5">
                                    <span> {node.node.structureDefinition.title}</span>
                                </li>
                            ))}
                        </ul>
                        {error ? (
                            <>
                                <hr className="my-4" />
                                <p className="text-red-500">Failed to load nodes:</p>
                                <p className="text-red-500 font-bold">{error.message}</p>
                            </>
                        ) : null}
                    </div>
                </>
            )}
            <hr className="my-4" />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleLogout}>
                Logout
            </button>
        </div>
    )
}

export default ContentList
