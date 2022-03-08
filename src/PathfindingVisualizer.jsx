import React, { Component } from 'react';
import Node from './Node/Node';
import './PathfindingVisualizer.css';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import NavBar from "./NavBar";

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.initialState = {
            grid: [],
            mouseIsPressed: false,
            startNodeChange: false,
            finishNodeChange: false,
            wallInNode:false,
            isVisualized: false,
            str: 10,
            stc: 15,
            ftr: 10,
            ftc: 35,
        };

        this.state = this.initialState;
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});
    }

    handleMouseDown(row, col) {
        if (this.state.grid[row][col].isStart &&
            !this.state.isVisualized &&
            !this.state.grid[row][col].isWall){
           this.setState({mouseIsPressed: true, startNodeChange: true});

        }

        else if (this.state.grid[row][col].isFinish &&
            !this.state.isVisualized &&
            !this.state.grid[row][col].isWall){
            this.setState({mouseIsPressed: true, finishNodeChange: true})
        }
        else if(!this.state.isVisualized &&
            !this.state.grid[row][col].isFinish &&
            !this.state.grid[row][col].isStart){

            const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
            this.setState({grid: newGrid, mouseIsPressed: true});
        }
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        else if(this.state.startNodeChange){
            if (!this.state.grid[row][col].isWall) {
                const newGrid = getNewGridWithChangedStartNode(this.state.grid, row, col)
                this.setState({grid: newGrid, str: row, stc: col, wallInNode: false});
            }
        }
        else if (this.state.finishNodeChange){
            if (!this.state.grid[row][col].isWall) {
                const newGrid = getNewGridWithChangedFinishNode(this.state.grid, row, col);
                this.setState({grid: newGrid, ftr: row, ftc: col, wallInNode: false})
            }

        }
        else if(!this.state.isVisualized &&
            !this.state.grid[row][col].isFinish &&
            !this.state.grid[row][col].isStart){
            const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
            this.setState({grid: newGrid});
        }

        else {
            this.setState({wallInNode:true})
        }
    }

    handleMouseLeave(row, col) {
        if (!this.state.wallInNode) {
            if (this.state.startNodeChange) {
                const {grid} = this.state;
                grid[row][col].isStart = false;
            } else if (this.state.finishNodeChange) {
                const {grid} = this.state;
                grid[row][col].isFinish = false;
            }
        }
        else {
            this.state.grid[row][col].isStart = true;
        }
        }
    handleMouseUp() {
        this.setState({mouseIsPressed: false, startNodeChange: false, finishNodeChange: false, wallInNode: false});
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        this.setState({isVisualized:true})
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
            }, 10 * i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
            }, 50 * i);
        }
    }

    visualizeDijkstra() {
        const {grid, str, stc, ftr, ftc} = this.state;
        const startNode = grid[str][stc];
        const finishNode = grid[ftr][ftc];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    resetGrid() {
        this.setState({isVisualized:true})
        window.location.reload();

    }

    render() {
        const {grid, mouseIsPressed} = this.state;

        return (
            <>
                <NavBar
                    visualizeDijkstra = {() => this.visualizeDijkstra()}
                    resetGrid = {() => this.resetGrid()}
                    isVisualized = {this.state.isVisualized}
                ></NavBar>

                <div className='grid'>
                    <div className="key">Start Node: <span className='startNodeIcon'> </span></div>
                    <div className="key">Finish Node: <span className='finishNodeIcon'> </span> </div>
                    <div className="key">Wall: <span className ='wallIcon'> </span> </div>
                </div>

                <div className="container">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const {row, col, isFinish, isStart, isWall} = node;
                                    return (
                                        <Node
                                            key={nodeIdx}
                                            col={col}
                                            isFinish={isFinish}
                                            isStart={isStart}
                                            isWall={isWall}
                                            mouseIsPressed={mouseIsPressed}
                                            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                            onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                            onMouseUp={() => this.handleMouseUp()}
                                            onMouseLeave = {() => this.handleMouseLeave(row, col)}
                                            row={row}></Node>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }
}

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const getNewGridWithChangedStartNode = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isStart: true,
    };
    newGrid[row][col] = newNode;
    return newGrid;
}

const getNewGridWithChangedFinishNode = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isFinish: true,
    };
    newGrid[row][col] = newNode;
    return newGrid;
}