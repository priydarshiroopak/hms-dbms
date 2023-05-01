const express = require('express');
const cors = require('cors');
 
const {pool, executeQuery} = require('./db');
const sendMail = require('./send-mail');

  
// create express app and start server
const app = express();
app.use(express.json({limit: '20mb'}));
app.use(cors());


const port_no = 3001;

app.listen(port_no, function(){
    console.log('Server is running on port ', port_no, '...');
});

// Use the connection pool in your Express app
app.use((req, res, next) => {
    console.log('\n\nmethod: ', req.method);
    console.log('url: ', req.url);
    console.log('body: ', req.body, '\n\n');

    req.db = pool;
    next();
});


// Import Routers
const doctorRouter = require('./doctor');
const loginRouter = require('./login');
const adminRouter = require('./admin');
const frontDeskRouter = require('./front-desk');
const dataEntryRouter = require('./data-entry');



// Provide Routes
app.use('/doctor', doctorRouter);
app.use('/login', loginRouter);
app.use('/admin', adminRouter);
app.use('/front-desk', frontDeskRouter);
app.use('/data-entry', dataEntryRouter);


// 404 Handler
app.use((req, res) => {
    res.status(404).send({message: 'NOT FOUND!'});
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});




async function test(){
    let sql_query, physicians, mailText;
    const abc={db: pool};

    // get all physicians
    sql_query = `SELECT PhysicianID FROM Physician;`;
    physicians = await executeQuery(sql_query, abc);
    console.log(physicians);

    physicians.rows.forEach(async physician => {

        // get physician's email
        sql_query = `SELECT Email FROM User WHERE EmployeeID='${physician.PhysicianID}';`;
        let doc_email = await executeQuery(sql_query, abc);

        let act_email=doc_email.rows[0].Email;
        console.log(act_email);

        //get all patients of the physician
        sql_query = `SELECT Patient_Name, Patient.Patient_SSN, Email, Appointment.Date`+
                    ` FROM Patient NATURAL JOIN Physician NATURAL JOIN Appointment WHERE `+
                    `Physician.PhysicianID='${physician.PhysicianID}';`;
        
        
        let result = await executeQuery(sql_query, abc);
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

        // Send the mail
        sendMail(act_email,"Weekly Report", mailText);
       
        
       
    });
  
} 


setInterval(() => {
    test(); }, 7*24*60*60*1000);



