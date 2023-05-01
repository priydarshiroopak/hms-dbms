// Route for login
const express = require('express');
const loginRouter = express.Router();

const {decrypt} = require('./encryption-handler');
const {executeQuery} = require('./db');



// Post request done while sign up
loginRouter
.route('/')
.get(getLogin);


async function getLogin(req, res){
    //res.send('Get Login request received');
    console.log(req.query);

    const transformedObj = transformloginKeys(req.query);
    let sql_query = `SELECT * FROM User WHERE EmployeeID = '${transformedObj.id}' and Type=${transformedObj.type};`;
    console.log(sql_query);
    
    let result = await executeQuery(sql_query, req);

    

    if(result.status!=200){
      res.status(result.status).send(result);
    }
    else if(result.rows.length === 0){
      // if result is an empty object send login failed
      res.status(400).send({message: 'EmployeeID not found!', success: false});
    }
    else{

      const data = result.rows[0]; // Parse the string and extract the first object

      console.log("data: \n",data);

      const password = data.Password, iv = data.Pass_iv;

      console.log("send to dec: ", {encrypted_password: password, iv: iv});
      const decrypted = decrypt({encrypted_password: password, iv: iv});

      console.log("decrypted: ",decrypted);

      if(decrypted === transformedObj.Password){
        console.log('Login successful');
        res.status(200).send({ message: 'Login successful', success: true });
      } 
      else
      {
        console.log('Login failed');
        res.status(400).send({ message: 'Login failed. Incorrect Password!', success: false });
      }
    }
  }



function transformloginKeys(obj) {
  const transformedObj = {};
  for (const key in obj) {
    if (key === 'email') {
      transformedObj['Email'] = obj[key];
    } if (key === 'pass') {
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


module.exports = loginRouter;
