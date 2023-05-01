import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormGroup, Label, Col, Input, Form, Button } from "reactstrap";
import useToken from "./useToken";

export default function Login(props) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState(1);

  const navigate = useNavigate();
  const server_addr = props.server_addr;
  const login = { id, password, type };

  const handleLogin = (e) => {
    let status;
    e.preventDefault();
    console.log("login details!", type, id, password);
    fetch(`http://${server_addr}/login/?type=${type}&id=${id}&pass=${password}`)
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log("logged in!!!!", login, " hello ", data);
      status = data;
      if (data.success === true) {
        alert("logged in!", status.message);
        props.onLogin(id);
        sessionStorage.setItem('token', JSON.stringify({ logged_in: true, type: type }));
        navigate(`/user${type}`);
      } else {
        alert("Authentication Failed ", status.message);
      }
    });
    //   props.onLogin(1);
    //   sessionStorage.setItem('token', JSON.stringify({ logged_in: true, type: type }));
    //   navigate(`/user${type}`);
    // console.log("logging in");
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>{props.name}</h1>
        <hr />
      </header>
      <div className="App-body">
        <h2>Login</h2>
        <div className="managedocs">
          <Form onSubmit={(e) => handleLogin(e)}>
            <FormGroup row>
              <Label for="type" sm={3}>Type:</Label>
              <Col sm={9}>
                <Input type="select" name="type" id="type" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value={1}>Front-Desk</option>
                  <option value={2}>Data-Entry</option>
                  <option value={3}>Doctor</option>
                  <option value={4}>Administrator</option>
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="empid" sm={3}>Employee ID:</Label>
              <Col sm={9}>
                <Input type="text" name="empid" id="empid" placeholder="Enter Employee ID....." required value={id} onChange={(e) => setId(e.target.value)} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="password" sm={3}>Password:</Label>
              <Col sm={9}>
                <Input type="password" name="password" id="password" placeholder="Enter Password....." required value={password} onChange={(e) => setPassword(e.target.value)} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={{ size: 9, offset: 4 }}>
                <Button type="submit" color="primary">Login</Button>
              </Col>
            </FormGroup>
          </Form>
          {/* <form onSubmit={(e) => handleLogin(e)}>
            <label>Login</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value={1}>Front-End</option>
              <option value={2}>Data-Entry</option>
              <option value={3}>Doctor</option>
              <option value={4}>Administrator</option>
            </select>
            <input type="text"
              name="empid"
              required
              placeholder="Employee ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <input type="password"
              name="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button>Login</button>
          </form> */}
        </div>

      </div>
    </div>
  );
}
