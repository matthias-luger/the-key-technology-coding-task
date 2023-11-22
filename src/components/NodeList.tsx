import { useQuery } from '@apollo/client'
import { GET_CONTENT_NODES_QUERY } from '../utils/Queries'

interface ContentNode {
    node: {
        structureDefinition: {
            title: string
        }
    }
}

export interface ContentNodeQueryResult {
    Admin: {
        Tree: {
            GetContentNodes: {
                edges: ContentNode[]
            }
        }
    }
}

const NodeList = () => {
    const { loading, error, data } = useQuery<ContentNodeQueryResult>(GET_CONTENT_NODES_QUERY)

    const contentNodes = data ? data.Admin.Tree.GetContentNodes.edges : []
    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Content Nodes</h2>
            {loading ? (
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-4 border-blue-500 border-solid mb-4"></div>
                    <p className="text-gray-600">Loading nodes...</p>
                </div>
            ) : (
                <>
                    <div className="h-80 overflow-y-scroll">
                        <ul id="node-list" className="list-none pl-4 divide-y divide-gray-100">
                            {contentNodes.map((node, index) => (
                                <li key={index} className="py-5">
                                    <span> {node.node.structureDefinition.title}</span>
                                </li>
                            ))}
                            {contentNodes.length === 0 ? (
                                <>
                                    <li className="py-5 text-gray-500">
                                        <span> No nodes found</span>
                                    </li>
                                </>
                            ) : null}
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
        </>
    )
}

export default NodeList
