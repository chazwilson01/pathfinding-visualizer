import React, { Component } from "react";

class NavBar extends Component{
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return(
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand">Pathfinding Visualizer</a>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <button
                                    onClick={() => this.props.visualizeDijkstra()}
                                    disabled={this.props.isVisualized}
                                    type = 'button'
                                    className ="btn btn-primary btn-sm m-2"
                                    id='nav-button'
                                >
                                    Visualize Dijkstra's Algorithm
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    onClick={() => this.props.resetGrid()}
                                    className='btn btn-danger btn-sm m-2'
                                    id='nav-button'
                                >
                                    Clear Board
                                </button>
                            </li>
                            <li className="nav-item">
                            </li>
                            <li className="nav-item">

                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}


export default NavBar;