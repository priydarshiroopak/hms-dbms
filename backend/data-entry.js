const express = require('express');
const dataEntryRouter = express.Router();


const { executeQuery } = require('./db');

dataEntryRouter
.route('/test-result')
.get(get_tests)
.post(add_test_result);

dataEntryRouter
.route('/treatment-result')
.get(get_treatments)
.post(add_treatment_result);


async function get_tests(req, res){
    let sql_query = '', result = {};
   
    sql_query = `SELECT Test_instanceID, Test_Name, Patient_SSN, Patient_Name, Date, Start, End `+
                `FROM Test_instance NATURAL JOIN Test NATURAL JOIN Patient NATURAL JOIN Slot `+
                `WHERE Result IS NULL;`;
    result = await executeQuery(sql_query, req);

    result['tests'] = result.rows;
    delete result.rows;

    for(i in result.tests){
        result.tests[i]['Date'] = result.tests[i]['Date'].toISOString().slice(0, 10).replace('T', ' ');
    }
    
    res.status(result.status).send(result);

}

async function add_test_result(req, res){
    // convert to string
    //console.log(req);
    // console.log(req.file);
    // console.log(req.testId);
    // console.log(req.remarks);
    // console.log(req.body.file);
    // console.log(req.body.tesid);
    const upload_file=req.body.file;
    // const {test_instanceid, test_result} = req.body;
    let sql_query = `UPDATE Test_instance SET Result='${req.body.remarks}',Test_image= x'${upload_file}' WHERE Test_instanceID=${req.body.test_id};`;
    let result = await executeQuery(sql_query, req);
    let sql_query2= `SELECT * from Test_instance WHERE Test_instanceID=${req.body.test_id};`;
    let result2=await executeQuery(sql_query2, req);

    //console.log(result2.rows); 
    result.image = result2.rows[0]['Test_image'];
    //console.log(result.image);
    res.status(result.status).send(result);
    //res.status(200).send({message: 'Hehe'});
    // res.status(200).send({message: 'Hehe'});
    
}



async function get_treatments(req, res){
    let sql_query = '', result = {};
    // get non-admitted patients
    sql_query = `SELECT TreatmentID, Desc_Name, Patient_SSN, Patient_Name, Date, Start, End `+
                `FROM Treatment NATURAL JOIN Treatment_Description NATURAL JOIN Patient NATURAL JOIN Slot `+
                `WHERE Treatment_Remarks IS NULL;`;
    result = await executeQuery(sql_query, req);

    result['treatments'] = result.rows;
    delete result.rows;

    for(i in result.tests){
        result.tests[i]['Date'] = result.tests[i]['Date'].toISOString().slice(0, 10).replace('T', ' ');
    }
    
    res.status(result.status).send(result);

}

async function add_treatment_result(req, res){
    // convert to string

    console.log(req.body);
    const {treatmentid, treatment_remarks, successful} = req.body;
    let sql_query = `UPDATE Treatment SET Treatment_Remarks='${treatment_remarks}', Successful=${successful} WHERE TreatmentID=${treatmentid};`;
    let result = await executeQuery(sql_query, req);
    
    res.status(result.status).send(result);
   
}

module.exports = dataEntryRouter;