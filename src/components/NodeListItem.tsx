import { CSSProperties, useRef } from 'react'
import { ContentNode } from './NodeList'
import { XYCoord, useDrag, useDrop } from 'react-dnd'

interface Props {
    index: number
    contentNode: ContentNode
    style: CSSProperties
    moveNode: (dragIndex: number, hoverIndex: number) => void
}

interface DragItem {
    index: number
    id: string
    type: string
}

const DraggableNodeListItem = ({ contentNode, style, index, moveNode }: Props) => {
    const dragRef = useRef<HTMLLIElement>(null)
    const [, drop] = useDrop<DragItem>({
        accept: 'node-list-item',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId()
            }
        },
        hover(item: DragItem, monitor) {
            if (!dragRef.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index

            if (dragIndex === hoverIndex) {
                return
            }

            // calculate if the node should move
            const hoverBoundingRect = dragRef.current?.getBoundingClientRect()
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            const clientOffset = monitor.getClientOffset()
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }

            moveNode(dragIndex, hoverIndex)
            item.index = hoverIndex
        }
    })

    const [{ isDragging }, drag] = useDrag({
        type: 'node-list-item',
        item: () => {
            return { id: contentNode.node.id, index }
        },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        }),
        isDragging(monitor) {
            return contentNode.node.id === monitor.getItem().id
        }
    })
    drag(drop(dragRef))

    return (
        <li
            ref={dragRef}
            key={contentNode.node.id}
            className="border-b-2 border-gray-300 transition-all duration-300 hover:bg-gray-100 flex items-center"
            style={{ ...style, color: isDragging ? 'rgba(0,0,0, 0.2)' : 'inherit' }}
        >
            <span className="text-lg font-semibold">{contentNode.node.structureDefinition.title}</span>
        </li>
    )
}

export default DraggableNodeListItem
