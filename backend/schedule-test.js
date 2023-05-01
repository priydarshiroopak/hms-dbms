const express = require('express');
const testRouter = express.Router();
const {executeQuery} = require('./db');

testRouter
.route('/')
.get(getTestsAndSlots)
.post(addTest);


async function getTestsAndSlots(req, res){
    let data = {tests: [], slots: [], status: 200, message: 'OK'};
    let sql_query = 'SELECT Test_instanceID, Test_Name, Cost, Patient_Name, Name AS Physician_Name FROM Test NATURAL JOIN Test_instance NATURAL JOIN Patient JOIN User ON User.EmployeeID = Test_instance.PhysicianID WHERE Test_instance.SlotID is NULL;';
    let result = await executeQuery(sql_query, req);
    
    if(result.status > data.status){
        data.status = result.status;
        data.message = result.message;
    }
    data['tests'] = result.rows;

    sql_query = 'SELECT * FROM Slot;';
    result = await executeQuery(sql_query, req);

    if(result.status > data.status){
        data.status = result.status;
        data.message = result.message;
    }
    data['slots'] = result.rows;

    res.status(data.status).send(data);

}

async function addTest(req, res){
    const {Test_instanceID, date, slotID} = req.body;

    const sql_query = `UPDATE Test_instance SET Date = '${date}', SlotID = ${slotID} `+
                      `WHERE Test_instanceID = ${Test_instanceID} `;

    const result = await executeQuery(sql_query, req);
    res.status(result.status).send(result);
    
}


module.exports = testRouter;
