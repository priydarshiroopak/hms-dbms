const express = require('express');
const appointmentRouter = express.Router();
const {executeQuery} = require('./db');
const sendMail = require('./send-mail');

appointmentRouter
.route('/')
.get(getDoctorsToSchedule);

appointmentRouter
.route('/slots')
.get(getSlots)
.post(addAppointment);
 
async function getDoctorsToSchedule(req, res){
    
    let data = {doctors: [], patients: [], message: 'OK'};
    let get_doctors = 'SELECT Name, PhysicianID AS id, Position FROM Physician INNER JOIN User ON Physician.PhysicianID = User.EmployeeID;';
    let get_patients = 'SELECT Patient_Name, Patient_SSN AS id, Age, Gender FROM Patient;';

    let result = await executeQuery(get_doctors, req, res);
    data.doctors = result.rows;
    if(result.status != 200){
        res.status(result.status).send(result);
        return;
    }
    result = await executeQuery(get_patients, req, res);
    data.patients = result.rows;
    data.message = result.message;
    res.status(result.status).send(data);
}


async function getSlots(req, res){
    const req_date=req.query.date;
    const doc_id=req.query.docId;
    let sql_query = `SELECT SlotID,Start,End FROM Slot WHERE  SlotID NOT IN `+
                    `(SELECT SlotID FROM Appointment WHERE Date='${req_date}' and PhysicianID='${doc_id}') `+
                    `AND SlotID NOT IN (SELECT SlotID FROM Treatment WHERE Date='${req_date}' and PhysicianID='${doc_id}');`;

    let result = await executeQuery(sql_query, req, res);
    result['slots'] = result['rows']; result['rows'] = undefined;


    if(req.query.emergency == 'true'){
        sql_query = 'SELECT SlotID,Start,End FROM Slot;';
        let temp = result;
        result = await executeQuery(sql_query, req);
        result['slots'] = result['rows']; result['rows'] = undefined;
        

        for(let i in result['slots']){
            let slot = result['slots'][i];
            let found = false;
            for(let j in temp['slots']){
                if(slot['SlotID'] == temp['slots'][j]['SlotID']){
                    found = true;
                    break;
                }
            }
            
            if(found)
                result['slots'][i]['booked'] = false;
            else
                result['slots'][i]['booked'] = true;
        }
    }

    res.status(result.status).send(result);
}



async function addAppointment(req, res){
    const {date, slotID, docID, patientSSN, overwrite} = req.body;
    
    let sql_query = '', result = {};
    console.log(req.body);
    if(overwrite == true){
        console.log('Overwrite ho raha hai');


        //////////////////////////
        // send mail to previous patient
        sql_query = `SELECT Patient.Patient_SSN, Email FROM Appointment NATURAL JOIN Patient WHERE Date='${date}' AND SlotID=${slotID} AND PhysicianID='${docID}';`;
        result = await executeQuery(sql_query, req, res);
        if(result.status != 200){
            res.status(result.status).send(result);
            return;
        }  
        console.log(result);
        
        if(result.rows.length == 0){
            res.status(500).send({message: 'internal error'});
            return;
        }

        // //************ send mail to previous patient ************

        sql_query=`SELECT Email from Patient NATURAL JOIN Appointment WHERE Appointment.Date='${date}' and Appointment.SlotID=${slotID}`;
        result = await executeQuery(sql_query, req);
        const patient_email=result.rows[0].Email;

        console.log(patient_email);
        let mailText = `Sorry due to emergency your appointment is cancelled on ${date}. Please contact the hospital for scheduling appointment.`;
        console.log(mailText);


        let second_query=`Select Email from Physician,User,Appointment WHERE Appointment.Date='${date}' and Appointment.SlotID=${slotID} and Appointment.PhysicianID=Physician.PhysicianID and Physician.PhysicianID=User.EmployeeID`;
        let result2 = await executeQuery(second_query, req);
        const physician_email=result2.rows[0].Email;
        console.log(physician_email);
        let mailText2 = `Sorry due to emergency your appointment is changed for 2023-03-22 during 10:20:00 :11:00:00. You can login due to view further details.`;
        console.log(mailText2);

        sendMail(patient_email,"Regarding Appointment", mailText);
        sendMail(physician_email,"Regarding Appointment", mailText2);



  

        ////////////////////

        sql_query = `UPDATE Appointment SET Patient_SSN=${patientSSN} WHERE Date='${date}' AND SlotID=${slotID} AND PhysicianID='${docID}';`;
        result = await executeQuery(sql_query, req, res);
        res.status(result.status).send(result);

        console.log('Overwrite result: ', result);


    }
    else{
        sql_query = `INSERT INTO Appointment (Date, SlotID, PhysicianID, Patient_SSN) VALUES ('${date}', ${slotID}, '${docID}', ${patientSSN});`;
        const result = await executeQuery(sql_query, req, res);
        res.status(result.status).send(result);
    }
}


module.exports = appointmentRouter;
