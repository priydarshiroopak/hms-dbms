
// Route for doctor
const express = require('express');
const doctorRouter = express.Router();
const {executeQuery} = require('./db');

doctorRouter
.route('/:id')
.get(getDoctorByID)
 

async function getDoctorByID(req, res){
    let id = req.params.id;
    let query = req.query;

    if(id == undefined){
        res.status(400).send({message: 'Invalid request'});
        return;
    }

    let sql_query = '';

    if(Object.keys(query).length == 0){
        sql_query = `SELECT AppointmentID AS id, Patient_SSN, Patient_Name, Age, Gender, Date, Start, End FROM Patient NATURAL JOIN Appointment NATURAL JOIN Slot WHERE PhysicianID=${id}`;
    }
    else{
        console.log(query);
        const type = query.type;
        const patient_id = query.patient;
        console.log(type);
        console.log(patient_id);

        if(patient_id == undefined || type == undefined){
            res.status(400).send({message: 'Invalid query'});
            return;
        }
        else if(type == 'treatment')
            sql_query = 'SELECT User.Name as"Physician Name",Desc_Name as "Treatment Name",Date FROM Treatment_Description NATURAL JOIN Treatment NATURAL JOIN Patient NATURAL JOIN Physician NATURAL JOIN Slot,User WHERE User.EmployeeID=PhysicianID and Patient_SSN='+patient_id+";";
        else if(type == 'medication')
            sql_query = `SELECT User.Name as 'Physician Name', Medication_Name as 'Medication Name',Brand as Brand,Date,AppointmentID as 'Appointment ID' FROM Prescribes_Medication NATURAL JOIN Medication NATURAL JOIN Physician NATURAL JOIN Patient,User WHERE Patient_SSN=${patient_id} and User.EmployeeID=PhysicianID;`;
        else if(type == 'appointment')
            sql_query = `SELECT AppointmentID as 'Appointment ID', User.Name as 'Physician Name', Date FROM Appointment NATURAL JOIN Patient NATURAL JOIN Physician NATURAL JOIN Slot,User WHERE Patient_SSN=${patient_id} and  User.EmployeeID=PhysicianID;`;
        else if(type == 'test')
            sql_query = `SELECT Test_instanceID as TestID,Test_Name, Result, Date, Age, Gender FROM Test_instance NATURAL JOIN Test NATURAL JOIN Patient WHERE Patient_SSN=${patient_id};`;   
        else if(type == 'test_image'){
            //console.log('hi')
            const test_id=req.query.id;
            sql_query = `SELECT Test_image from Test_instance WHERE  Test_instanceID=${test_id};`;
            //console.log("dfjk");
            let result = await executeQuery(sql_query, req);
            //console.log("dfjk");
            result.image = result.rows[0]['Test_image'];
            result.rows = undefined;
            //console.log(result);
            res.status(result.status).send(result);
            return;
        }
        else{
            res.status(400).send({message: 'Invalid query type'});
            return;
        }
        
    }
    let result = await executeQuery(sql_query, req);
    if(result.status!=200){
        res.status(result.status).send(result);
        return;
    }

    let rows = result.rows;
    formatDate(rows);
    if(Object.keys(query).length == 0){
        let past_appointments = [], upcoming_appointments = [];
        const currentTime = new Date();
        for(let i = 0; i < rows.length; i++){
            const row = rows[i];
            const appointmentStart = new Date(row['Date'] + ' ' + row['Start']);
            const appointmentEnd = new Date(row['Date'] + ' ' + row['End']);

            
            if(appointmentEnd < currentTime)
                past_appointments.push(row);
            else{
                if(appointmentStart < currentTime)
                    row['Appointment Status'] = 'On going';
                else
                    row['Appointment Status'] = 'Not Started';

                upcoming_appointments.push(row);
            }
        }
        result['past_appointments'] = past_appointments;
        result['upcoming_appointments'] = upcoming_appointments;
        result['rows'] = undefined;
    }

    res.status(200).send(result);

}

function formatDate(rows){
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        for (const key in row) {
            if (row.hasOwnProperty(key)) {
                const value = row[key];
                if (value instanceof Date) {
                    const date = new Date(value);
                    const formattedDate = date.toISOString().slice(0, 10);
                    row[key] = `${formattedDate}`;
                }   
            }
        }
    }
}




const prescribesRouter = require('./prescribes');
doctorRouter.use('/:id/prescribes', prescribesRouter);


module.exports = doctorRouter;
