import React, { useImperativeHandle, useRef } from "react";
import { DragSource, DropTarget } from "react-dnd";

// Drag sources and drop targets only interact
// if they have the same string type.
// You want to keep types in a separate file with
// the rest of your app's constants.
const Types = {
  FILE: "file"
};

/**
 * Specifies the drag source contract.
 * Only `beginDrag` function is required.
 */
const cardSource = {
  beginDrag(props) {
    // Return the data describing the dragged item
    let item = { ...props.file };
    item.index = props.index;
    item.group = props.group;
    return item;
  },
  endDrag(props, monitor) {
    console.log(props);
    console.log(monitor.getItem());
    console.log(monitor.getDropResult());
  }
};

const fileTarget = {
  hover(props, monitor, component) {
    if (!component) {
      return null;
    }
    // node = HTML Div element from imperative API
    const node = component.getNode();
    if (!node) {
      return null;
    }

    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    const dragGroup = monitor.getItem().group;
    const targetGroup = props.group;

    // Don't replace items with themselves

    if (dragIndex === hoverIndex && dragGroup === targetGroup) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = node.getBoundingClientRect();

    // Scroll window if mouse near vertical edge(100px)
    const windowY = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );

    const mouseY = monitor.getClientOffset().y;
    if (windowY - mouseY < 100) {
      window.scroll({
        top: 100,
        left: 0,
        behavior: "smooth"
      });
    }
    if (mouseY < 100) {
      window.scroll({
        top: -100,
        left: 0,
        behavior: "smooth"
      });
    }

    // Horizontal Check --

    if (
      Math.abs(monitor.getClientOffset().x - hoverBoundingRect.left) >
      hoverBoundingRect.width / 2
    )
      return;

    // Vertical Check |

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex, dragGroup, targetGroup);
    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    //console.log(monitor.getItem());
    monitor.getItem().index = hoverIndex;
    monitor.getItem().group = targetGroup;
  }
};

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging(),
    getItem: monitor.getItem()
  };
}

const style = {
  border: "1px dashed gray",
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move"
};

const File = React.forwardRef(
  (
    { file, group, isDragging, getItem, connectDragSource, connectDropTarget },
    ref
  ) => {
    const elementRef = useRef(null);
    connectDragSource(elementRef);
    connectDropTarget(elementRef);
    let draggedId = null;
    if (getItem !== null) {
      draggedId = getItem.id;
    }

    const opacity = draggedId === file.id ? 0.3 : 1;
    let backgroundColor = "#dad9f3";
    if (file.type === "file") backgroundColor = "#f4d6d2";

    if (file.type === "img") backgroundColor = "#d9f3e9";

    useImperativeHandle(ref, () => ({
      getNode: () => elementRef.current
    }));
    return (
      <div
        ref={elementRef}
        className="card-file"
        style={Object.assign({}, style, { opacity, backgroundColor })}
      >
        <h4>{file.name}</h4>I am a draggable card number {file.id}
      </div>
    );
  }
);

// Export the wrapped version
export default DropTarget(Types.FILE, fileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType()
}))(DragSource(Types.FILE, cardSource, collect)(File));
