const express = require('express');
const prescribesRouter = express.Router();

const {executeQuery} = require('./db');

prescribesRouter
.route('/')
.get(getMedTestTreatment)
.post(addPrescribes);

async function getMedTestTreatment(req, res){

    let get_med = 'SELECT Medication_Name AS name, MedicationID AS id FROM Medication;';
    let get_test = 'SELECT Test_Name AS name, TestID AS id FROM Test;';
    let get_treatment = 'SELECT Desc_Name AS name, Treatment_DescriptionID AS id FROM Treatment_Description;';

    let data = {Medication: [], Test: [], Treatment: [], status: 200, message: 'OK'};

    let meds = await executeQuery(get_med, req, res); data.Medication = meds.rows;
    if(meds.status > data.status){
        data.status = meds.status; 
        data.message = meds.message;
    }
    
    let tests = await executeQuery(get_test, req, res); data.Test = tests.rows;
    if(tests.status > data.status){
        data.status = tests.status;
        data.message = tests.message;
    }

    let treatments = await executeQuery(get_treatment, req, res);  data.Treatment = treatments.rows;
    if(treatments.status > data.status){
        data.status = treatments.status;
        data.message = treatments.message;
    }
    // console.log("Data:\n", data);
    res.status(data.status).send(data);

}


async function addPrescribes(req, res){
    console.log(req.body);

    const docID = req.body.did, Patient_SSN = req.body.pid, appointmentID = req.body.appointmentid;
    const date = req.body.date, prescription = req.body.prescription;
    

    console.log("body:\n", req.body);

    for(i in prescription){
        const body = prescription[i];
        if(body.type == undefined){
            res.status(400).send({message: 'Invalid request'}); return;
        }

        let sql_query = '';
        if(body.type == 'Medication'){
            sql_query = `INSERT INTO Prescribes_Medication (PhysicianID, Patient_SSN, MedicationID, Date, AppointmentID, Dose) `+
                        `VALUES ('${docID}', ${Patient_SSN}, ${body.id}, '${date}', ${appointmentID}, '${body.remarks}');`;
        }
        else if(body.type == 'Test'){
            sql_query = `INSERT INTO Test_instance (Patient_SSN, PhysicianID, TestID, SlotID, Result, Test_image, Date ) `+
                        `VALUES (${Patient_SSN}, ${docID}, '${body.id}', NULL, NULL, NULL, NULL);`;
        }
        else if(body.type == 'Treatment'){
            sql_query = `INSERT INTO Treatment (PhysicianID, Patient_SSN,Treatment_DescriptionID ) `+
                        `VALUES (${docID}, ${Patient_SSN}, ${body.id});`;
        }

        let result = await executeQuery(sql_query, req);
        // console.log("query:\n", sql_query);
        // console.log("result:\n", result);

        if(result.status != 200){
            res.status(result.status).send(result); return;
        }
    }

    res.status(200).send({message: 'OK'});
}


module.exports = prescribesRouter;