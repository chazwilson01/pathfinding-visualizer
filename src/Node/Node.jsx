import React, { Component } from 'react';
import './Node.css';

class Node extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }
    render() { 
        const {
            isFinish,
            isStart,
            isVisited,
            col,
            isWall,
            onMouseDown,
            onMouseEnter,
            onMouseUp,
            onMouseLeave,
            row,
        } = this.props;
        const extraClassName = isFinish 
        ? 'node-finish'
        : isStart 
        ? 'node-start'
        //: isVisited
        //?'node-visited'
        : isWall
        ? 'node-wall'
        :'';

        return <div
            className={`node ${extraClassName}`}
            id={`node-${row}-${col}`}
            onMouseUp={() => onMouseUp(row, col)}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseLeave={() => onMouseLeave(row, col)}


        ></div>;
    }
}
 
export default Node;