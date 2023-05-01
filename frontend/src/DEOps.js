import React from "react";
import { Link } from "react-router-dom";

function DEOps() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Data Entry Operator Dashboard</h1>
                <hr />
            </header>
            <div className="App-body">
                <div className="container_home">
                    <Link to="testResult" className="box"><button>Test Results</button></Link>
                    <Link to="treatmentResult" className="box"><button>Treatment Results</button></Link>
                </div>
            </div>
        </div >
    );
}
export default DEOps;