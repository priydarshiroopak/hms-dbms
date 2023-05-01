// Route for login
const express = require('express');
const loginRouter = express.Router();

const {encrypt, decrypt} = require('./encryption-handler');
const {executeQuery} = require('./db');


function createUser(req, res){
    console.log(req.body);
    const transformedObj = transformKeys(req.body);
    //insert transformedObj into database hms 
    const encrypted = encrypt(transformedObj.Password);
   
    const sqll = `INSERT INTO User (Name, Email, employee_id, Password, iv, type) VALUES ('${transformedObj.Name}', '${transformedObj.Email}', '${transformedObj.employee_id}', '${encrypted.encrypted_password}', '${encrypted.iv}', '${transformedObj.type}')`;
    pool.query(sqll, (err, result)=>{
        if(err) throw err;
        console.log(result)
        res.send(JSON.stringify({ message: 'Signup successful' }));
    });
  }
  
  
  function transformKeys(obj) {
    const transformedObj = {};
    for (const key in obj) {
      if (key === 'name') {
        transformedObj['Name'] = obj[key];
      } else if (key === 'email') {
        transformedObj['Email'] = obj[key];
      } else if (key === 'empid') {
        transformedObj['employee_id'] = obj[key];
      } else if (key === 'password') {
        transformedObj['Password'] = obj[key];
      } else if (key === 'type') {
        transformedObj['type'] = obj[key];
      }
      else{
        transformedObj[key] = obj[key];
      }
    }
    return transformedObj;
  }