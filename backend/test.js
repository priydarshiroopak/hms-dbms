const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
	host: '10.5.18.71',
	user: '20CS30021',
	password: '20CS30021',
	database: '20CS30021'
});

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL database: ', err);
        return;
    }
    console.log('Connected to MySQL database!');
    connection.release();
});

function executeQuery(sql_query, pool){  
    return new Promise((resolve, reject) => {
        let status = 200, message = 'OK';
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error connecting to MySQL database: ', err);
                status = 500; message = 'Internal Server Error'; 
                connection.release();
                resolve({status, message, rows: []});
                return;
            }
            
            connection.query(sql_query, (err, rows, fields) => {
                if(err){
                    status= 400; message = 'SQL query error';
                    console.log(err);
                }
                connection.release();
                resolve({status, message, rows});
            });
        }); 
    });
}

async function test(){
    let sql_query, physicians, mailText;

    // get all physicians
    sql_query = `SELECT PhysicianID FROM Physician;`;
    physicians = await executeQuery(sql_query, pool);
    console.log(physicians);

    physicians.rows.forEach(async physician => {

        // get physician's email
        sql_query = `SELECT Email FROM User WHERE EmployeeID='${physician.PhysicianID}';`;
        let doc_email = await executeQuery(sql_query, pool);

        let act_email=doc_email.rows[0].Email;
        console.log(act_email);

        //get all patients of the physician
        sql_query = `SELECT Patient_Name, Patient.Patient_SSN, Email, Appointment.Date`+
                    ` FROM Patient NATURAL JOIN Physician NATURAL JOIN Appointment WHERE `+
                    `Physician.PhysicianID='${physician.PhysicianID}';`;
        
        let result = await executeQuery(sql_query, pool);
        //console.log(result);
        // Assuming that the result of the SQL query is stored in a variable called 'result'
        
        mailText = `Dear Physician,\n\nHere are the details of your patients:\n\n`;
        
        // Loop through each row in the result and add it to the mailText
        result.rows.forEach(row => {
        mailText += `Patient Name: ${row.Patient_Name}\n`;
        mailText += `Patient SSN: ${row.Patient_SSN}\n`;
        mailText += `Email: ${row.Email}\n`;
        mailText += `Appointment Date: ${row.Date}\n\n`;
        // mailText += `Test Result: ${row.Test_Result}\n`;
        // mailText += `Test Image: ${row.Test_Image}\n`;
        // mailText += `Test Date: ${row.Test_Date}\n`;
        // mailText += `Treatment Name: ${row.Treatment_Name}\n`;
        // mailText += `Treatment Date: ${row.Treatment_Date}\n\n`;
        });
        
        // Add closing message to the mailText
        mailText += `Thank you,\nYour Hospital`;
        console.log(mailText);
       
        
       
    });
  
} 
  
async function testmail()
{
    let sql_query="SELECT Email from Patient NATURAL JOIN Appointment WHERE Appointment.Date='2023-03-22' and Appointment.SlotID=3";
    let result = await executeQuery(sql_query, pool);
    const patient_email=result.rows[0].Email;
    console.log(patient_email);
    let mailText = `Sorry due to emergency your appointment is cancelled on 2023-03-22 during 10:20:00 :11:00:00. Please contact the hospital for scheduling appointment.`;
    console.log(mailText);
    let second_query="Select Email from Physician,User,Appointment WHERE Appointment.Date='2023-03-22' and Appointment.SlotID=3 and Appointment.PhysicianID=Physician.PhysicianID and Physician.PhysicianID=User.EmployeeID";
    let result2 = await executeQuery(second_query, pool);
    const physician_email=result2.rows[0].Email;
    console.log(physician_email);
    let mailText2 = `Sorry due to emergency your appointment is changed for 2023-03-22 during 10:20:00 :11:00:00. You can login due to view further details.`;
    console.log(mailText2);
}
test(); 
//testmail();