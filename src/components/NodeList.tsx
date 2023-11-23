import { useQuery } from '@apollo/client'
import { GET_CONTENT_NODES_QUERY } from '../utils/Queries'
import { FixedSizeList as List } from 'react-window'

interface ContentNode {
    node: {
        id: string
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
                    <List
                        itemKey={index => {
                            return contentNodes[index].node.id
                        }}
                        className="list-none pl-4"
                        height={320}
                        itemCount={contentNodes.length}
                        itemSize={50}
                        width={'auto'}
                    >
                        {({ index, style }) => {
                            return (
                                <li
                                    key={index}
                                    className="border-b-2 border-gray-300 transition-all duration-300 hover:bg-gray-100 flex items-center"
                                    style={style}
                                >
                                    <span className="text-lg font-semibold">{contentNodes[index].node.structureDefinition.title}</span>
                                </li>
                            )
                        }}
                    </List>
                    {contentNodes.length === 0 && !error ? (
                        <>
                            <li className="py-5 text-gray-500">
                                <span> No nodes found</span>
                            </li>
                        </>
                    ) : null}
                    {error ? (
                        <>
                            <hr className="my-4" />
                            <p className="text-red-500">Failed to load nodes:</p>
                            <p className="text-red-500 font-bold">{error.message}</p>
                        </>
                    ) : null}
                </>
            )}
        </>
    )
}

export default NodeList
