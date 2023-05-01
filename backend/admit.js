const express = require('express');
const admitRouter = express.Router();

const { executeQuery } = require('./db');

admitRouter
.route('/')
.get(get_patient_roomno)
.post(admit_patient);

async function get_patient_roomno(req, res){
    let sql_query = '', result = {}, data = {};
    // get non-admitted patients
    sql_query = `SELECT Patient_SSN AS id, Patient_Name, Address, Age, Gender FROM Patient WHERE Status!='admitted';`;
    result = await executeQuery(sql_query, req);
    if(result.status != 200){
        res.status(result.status).send(result);
        return;
    }
    data['patients'] = result.rows; 


    // get available rooms
    sql_query = `SELECT RoomID AS id FROM Room WHERE Unavailable=false;`;
    result = await executeQuery(sql_query, req);
    if(result.status != 200){
        res.status(result.status).send(result);
        return;
    }
    data['rooms'] = result.rows;
    res.status(200).send(data);
}

async function admit_patient(req, res)
{
    console.log(req.body);
    
    try{
        const {patient, room} = req.body;
        const date = new Date().toISOString().slice(0, 10).replace('T', ' ');

        let sql_query=`INSERT INTO Stay(Patient_SSN, RoomID, Start, End) VALUES('${patient}', ${room}, '${date}', NULL)`;
        let result = await executeQuery(sql_query, req);        
        if(result.status != 200){
            res.status(result.status).send(result);
            return;
        }
        
        sql_query=`UPDATE Room SET Unavailable=true WHERE RoomID=${room}`;
        result = await executeQuery(sql_query, req);
        if(result.status != 200){
            res.status(result.status).send(result);
            return;
        }

        sql_query=`UPDATE Patient SET Status='admitted' WHERE Patient_SSN='${patient}'`;
        result = await executeQuery(sql_query, req);


        res.status(result.status).send(result);
        return;
    }
    catch(err){
        res.status(500).send({status: 500, message: err.message});
    }
}

module.exports = admitRouter;