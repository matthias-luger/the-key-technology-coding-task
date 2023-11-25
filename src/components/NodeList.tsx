import { useQuery } from '@apollo/client'
import { GET_CONTENT_NODES_QUERY } from '../utils/Queries'
import { FixedSizeList as List } from 'react-window'
import DraggableNodeListItem from './DraggableNodeListItem'
import { useState } from 'react'
import { LOCAL_STORAGE_KEYS, getFromLocalStorage } from '../utils/LocalStorageUtils'
import { useNavigate } from 'react-router'

export interface ContentNode {
    id: string
    structureDefinition: {
        title: string
    }
}
export interface Edge {
    node: ContentNode
    cursor: string
}

export interface ContentNodeQueryResult {
    Admin: {
        Tree: {
            GetContentNodes: {
                edges: Edge[]
                pageInfo: {
                    hasNextPage: boolean
                    endCursor: string
                }
            }
        }
    }
}

const NodeList = () => {
    const { loading, error, fetchMore } = useQuery<ContentNodeQueryResult>(GET_CONTENT_NODES_QUERY, {
        variables: {
            first: 5
        },
        onCompleted(data) {
            setLastCursor(data.Admin.Tree.GetContentNodes.pageInfo.endCursor)
            updateLocalNodeData(data.Admin.Tree.GetContentNodes.edges)
            setHasNextPage(data.Admin.Tree.GetContentNodes.pageInfo.hasNextPage)
        }
    })
    const [hasNextPage, setHasNextPage] = useState<boolean>(true)
    const [lastCursor, setLastCursor] = useState<string>('')
    const [contentNodes, setContentNodes] = useState<Edge[]>([])
    const navigate = useNavigate()

    if (error && error.message === 'Response not successful: Received status code 401') {
        navigate('/login?forceLogout=true')
    }

    function fetchMoreNodes() {
        if (!hasNextPage) {
            return
        }
        fetchMore({
            variables: {
                after: lastCursor,
                first: 3
            },
            updateQuery: (previousData, options) => {
                if (!options.fetchMoreResult.Admin.Tree.GetContentNodes.pageInfo.hasNextPage) {
                    setHasNextPage(false)
                }

                const pageInfo = options.fetchMoreResult.Admin.Tree.GetContentNodes.pageInfo
                const newEdges = [...previousData.Admin.Tree.GetContentNodes.edges, ...options.fetchMoreResult.Admin.Tree.GetContentNodes.edges]

                setLastCursor(pageInfo.endCursor)
                updateLocalNodeData(newEdges)

                return {
                    Admin: {
                        Tree: {
                            GetContentNodes: {
                                edges: newEdges,
                                pageInfo
                            }
                        }
                    }
                }
            }
        })
    }

    function updateLocalNodeData(edges: Edge[], needsSorting = true) {
        let newContentNodes = [...edges]
        newContentNodes = newContentNodes.filter((edge, index, self) => {
            return index === self.findIndex(e => e.node.id === edge.node.id)
        })
        if (needsSorting) {
            const orderMap = JSON.parse(getFromLocalStorage(LOCAL_STORAGE_KEYS.NODE_ORDERS) || '{}')
            newContentNodes.sort((a, b) => {
                const orderA = orderMap[a.node.id] || Number.MAX_SAFE_INTEGER
                const orderB = orderMap[b.node.id] || Number.MAX_SAFE_INTEGER
                return orderA - orderB
            })
        }
        setContentNodes(newContentNodes)
    }

    function moveNode(dragIndex: number, hoverIndex: number) {
        const newNodes = [...contentNodes]
        const draggedItem = newNodes.splice(dragIndex, 1)[0]
        newNodes.splice(hoverIndex, 0, draggedItem)

        const nodeOrder: { [key: string]: number } = JSON.parse(getFromLocalStorage(LOCAL_STORAGE_KEYS.NODE_ORDERS) || '{}')
        newNodes.forEach((edge, index) => {
            nodeOrder[edge.node.id] = index + 1
        })
        localStorage.setItem(LOCAL_STORAGE_KEYS.NODE_ORDERS, JSON.stringify(nodeOrder))

        updateLocalNodeData(newNodes, false)
    }

    return (
        <div className="node-list">
            <h2 className="text-2xl font-bold mb-4">Content Nodes</h2>
            {loading ? (
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-4 border-blue-500 border-solid mb-4"></div>
                    <p className="text-gray-600">Loading nodes...</p>
                </div>
            ) : (
                <div>
                    <List<Edge>
                        onItemsRendered={props => {
                            if (loading) {
                                return
                            }
                            if (props.visibleStopIndex === contentNodes.length - 1) {
                                fetchMoreNodes()
                            }
                        }}
                        itemKey={index => {
                            return contentNodes[index]?.node?.id
                        }}
                        className="list-none pl-4"
                        height={320}
                        itemCount={contentNodes.length}
                        itemSize={80}
                        width={'auto'}
                    >
                        {({ index, style, data }) => {
                            return (
                                <DraggableNodeListItem
                                    index={index}
                                    key={contentNodes[index]?.node?.id}
                                    contentNode={contentNodes[index].node || data.node}
                                    style={style}
                                    moveNode={moveNode}
                                />
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
                </div>
            )}
        </div>
    )
}

export default NodeList
