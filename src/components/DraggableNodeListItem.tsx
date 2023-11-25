import { CSSProperties } from 'react'
import { ContentNode } from './NodeList'
import { DraggableProvided } from 'react-beautiful-dnd'

interface Props {
    index: number
    contentNode: ContentNode
    draggableProvided: DraggableProvided
    isDragging: boolean
    style: CSSProperties
}

const DraggableNodeListItem = ({ contentNode, style, index, isDragging, draggableProvided }: Props) => {
    return (
        <li
            data-is-dragging={isDragging}
            data-testid={contentNode.id}
            data-index={index}
            ref={draggableProvided.innerRef}
            {...draggableProvided.draggableProps}
            {...draggableProvided.dragHandleProps}
            key={contentNode.id}
            className="node-list-item border-b-2 border-gray-300 transition-all duration-300 hover:bg-gray-100 flex items-center"
            style={{ ...style, ...draggableProvided.draggableProps.style, color: isDragging ? 'rgba(0,0,0, 0.2)' : 'inherit' }}
        >
            <span className="text-lg font-semibold">{contentNode.structureDefinition.title}</span>
        </li>
    )
}

export default DraggableNodeListItem
