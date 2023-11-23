import { useQuery } from '@apollo/client'
import { GET_CONTENT_NODES_QUERY } from '../utils/Queries'
import { FixedSizeList as List } from 'react-window'
import DraggableNodeListItem from './NodeListItem'
import { useState } from 'react'

export interface ContentNode {
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
    const { loading, error } = useQuery<ContentNodeQueryResult>(GET_CONTENT_NODES_QUERY, {
        onCompleted: onAfterNodesLoaded
    })
    const [contentNodes, setContentNodes] = useState<ContentNode[]>([])

    function onAfterNodesLoaded(data: ContentNodeQueryResult) {
        // filter nodes with same id as this breaks react-window & drag'n'drop
        const ids: string[] = []
        const filtered = data.Admin.Tree.GetContentNodes.edges.filter(node => {
            if (ids.includes(node.node.id)) {
                return false
            } else {
                ids.push(node.node.id)
                return true
            }
        })
        setContentNodes(filtered)
    }

    function moveNode(dragIndex: number, hoverIndex: number) {
        const newNodes = [...contentNodes]
        const draggedItem = newNodes.splice(dragIndex, 1)[0]
        newNodes.splice(hoverIndex, 0, draggedItem)
        setContentNodes(newNodes)
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
                <>
                    <List<ContentNode>
                        itemKey={index => {
                            return contentNodes[index]?.node?.id || 'empty'
                        }}
                        className="list-none pl-4"
                        height={320}
                        itemCount={contentNodes.length}
                        itemSize={50}
                        width={'auto'}
                    >
                        {({ index, style, data }) => {
                            return (
                                <DraggableNodeListItem index={index} key={index} contentNode={contentNodes[index] || data} style={style} moveNode={moveNode} />
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
        </div>
    )
}

export default NodeList
