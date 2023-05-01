import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hospital Management System</h1>
        <hr />
        <h2>Login or Sign Up As.....</h2>
      </header>
      <div className="App-body">
        <div className="container_home">
          <Link to="user1" className="box"><button>Front Desk Operator</button></Link>
          <Link to="user2" className="box"><button>Data Entry Operator</button></Link>
          <Link to="user3" className="box"><button>Doctor</button></Link>
          <Link to="user4" className="box"><button>Database Administrator</button></Link>
        </div>
      </div>
    </div >
  );
}