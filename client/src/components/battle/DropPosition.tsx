import React from "react";
import { DropTarget } from "react-dnd";

import { DragTypes, POSITION_MIN_WIDTH, CARD_HEIGHT } from "../../constants";
import Position from "./Position";

interface PropTypes {
  connectDropTarget: Function; // somehow tsc can't check it correctly
  isOver: boolean;
  canDrop: boolean;

  width: number;
  children: any;
  onDrop: Function;
}

export class DropPosition extends React.PureComponent<PropTypes> {
  render() {
    const {
      children,
      canDrop,
      isOver,
      connectDropTarget,
      width
    }: PropTypes = this.props;
    //const isActive = canDrop && isOver;

    return connectDropTarget(
      <div>
        <Position width={width}>{children}</Position>
      </div>
    );
  }
}

const dropTarget = {
  drop({ onDrop }, monitor) {
    console.log("DropPosition->drop");
    onDrop(monitor.getItem());
  }
};

export default DropTarget(DragTypes.CARD, dropTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(DropPosition as any);