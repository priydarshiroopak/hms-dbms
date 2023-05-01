const express = require('express');
const frontDeskRouter = express.Router();

const appointmentRouter = require('./appointment');
const admitRouter = require('./admit');
const testRouter = require('./schedule-test');
const treatmentRouter = require('./schedule-treatment');
const { executeQuery } = require('./db');


frontDeskRouter
.route('/register')
.post(addPatient);

frontDeskRouter
.route('/discharge')
.get(getPatients)
.post(discharge_patient);
 

async function getPatients(req, res){
    let sql_query = `SELECT Patient_SSN, Patient_Name, Age, Gender, Email FROM Patient WHERE Status='admitted';`;
    let result = await executeQuery(sql_query, req);
    res.status(result.status).send(result);
}

async function discharge_patient(req, res)
{
    let sql_query, result;
    const {patient} = req.body;
    
    sql_query=`SELECT RoomID FROM Stay WHERE Patient_SSN=${patient} AND End IS NULL;`;
    result = await executeQuery(sql_query, req);
    if(result.status != 200){
        res.status(result.status).send(result);
        return;
    }

    if(result.rows.length == 0){
        res.status(400).send({message: 'Patient not admitted or already discharged'});
        return;
    }

    const room = result.rows[0].RoomID;
    const date = new Date().toISOString().slice(0, 10).replace('T', ' ');
   
    sql_query=`UPDATE Stay SET End='${date}' WHERE Patient_SSN=${patient}`;
    result = await executeQuery(sql_query, req);
    if(result.status != 200){
        res.status(result.status).send(result);
        return;
    }

    sql_query=`UPDATE Room SET Unavailable=false WHERE RoomID=${room}`;
    result = await executeQuery(sql_query, req);
    if(result.status != 200){
        res.status(result.status).send(result);
        return;
    }

    sql_query=`UPDATE Patient SET Status='discharged' WHERE Patient_SSN='${patient}'`;
    result = await executeQuery(sql_query, req);

    res.status(result.status).send(result);
} 



async function addPatient(req, res){
    const patient = req.body;
    let sql_query = `INSERT INTO Patient(Patient_SSN, Patient_Name, Address, Age, Gender, Phone, Email, Status, InsuranceID) `+
                    `VALUES (${patient.patient_ssn}, '${patient.patient_name}',  '${patient.address}', ${patient.age}, `+
                    `'${patient.gender}', '${patient.phone}', '${patient.email}', 'not admitted', ${patient.insuranceID});`
                    
    console.log(sql_query);
    let result = await executeQuery(sql_query, req);
    console.log(result);
    
    res.status(result.status).send(result);
    console.log('result sent');
 
}




frontDeskRouter.use('/appointment', appointmentRouter);
frontDeskRouter.use('/admit', admitRouter);
frontDeskRouter.use('/schedule-test', testRouter);
frontDeskRouter.use('/schedule-treatment', treatmentRouter);

module.exports = frontDeskRouter;