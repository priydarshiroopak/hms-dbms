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
    // "SELECT * FROM Test_instance;"
    // "Update Test_instance SET Date=null AND SlotID=null;"
    let sql_query = "SELECT * FROM Stay;" 
 
    let data = await executeQuery(sql_query, pool);
    console.log(data);
  
} 
  
test();     