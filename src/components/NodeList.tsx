import { useQuery } from '@apollo/client'
import { GET_CONTENT_NODES_QUERY } from '../utils/Queries'
import { FixedSizeList as List } from 'react-window'
import DraggableNodeListItem from './NodeListItem'
import { useMemo, useState } from 'react'

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
                }
            }
        }
    }
}

const NodeList = () => {
    const { loading, error, data, fetchMore, client } = useQuery<ContentNodeQueryResult>(GET_CONTENT_NODES_QUERY)
    const [hasNextPage, setHasNextPage] = useState<boolean>(true)

    const contentNodes = useMemo(() => {
        if (!data) {
            return []
        }

        let wasFiltered = false
        // filter nodes with same id as this breaks react-window & drag'n'drop
        const ids: string[] = []
        const filtered = data.Admin.Tree.GetContentNodes.edges.filter(node => {
            if (ids.includes(node.node.id)) {
                wasFiltered = true
                return false
            } else {
                ids.push(node.node.id)
                return true
            }
        })
        if (!data.Admin.Tree.GetContentNodes.pageInfo.hasNextPage) {
            setHasNextPage(false)
        }

        if (wasFiltered) {
            updateLocalNodeData(filtered)
        }

        return filtered
    }, [data])

    function fetchMoreNodes() {
        if (!hasNextPage) {
            return
        }
        fetchMore({
            variables: {
                after: contentNodes[contentNodes.length - 1].cursor
            },
            updateQuery: (previousData, options) => {
                if (!options.fetchMoreResult) {
                    return previousData
                }
                const newEdges = options.fetchMoreResult.Admin.Tree.GetContentNodes.edges
                const pageInfo = options.fetchMoreResult.Admin.Tree.GetContentNodes.pageInfo
                return newEdges.length
                    ? {
                          Admin: {
                              Tree: {
                                  GetContentNodes: {
                                      edges: [...previousData.Admin.Tree.GetContentNodes.edges, ...newEdges],
                                      pageInfo
                                  }
                              }
                          }
                      }
                    : previousData
            }
        })
    }

    function updateLocalNodeData(edges: Edge[]) {
        if (!data) {
            return
        }
        client.writeQuery<ContentNodeQueryResult>({
            query: GET_CONTENT_NODES_QUERY,
            data: {
                ...data,
                Admin: {
                    ...data.Admin,
                    Tree: {
                        ...data.Admin.Tree,
                        GetContentNodes: {
                            ...data.Admin.Tree.GetContentNodes,
                            edges: edges
                        }
                    }
                }
            }
        })
    }

    function moveNode(dragIndex: number, hoverIndex: number) {
        if (!data) {
            return
        }

        const newNodes = [...data.Admin.Tree.GetContentNodes.edges]
        const draggedItem = newNodes.splice(dragIndex, 1)[0]
        newNodes.splice(hoverIndex, 0, draggedItem)

        updateLocalNodeData(newNodes)
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
                                    key={index}
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
