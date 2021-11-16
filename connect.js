const mysql = require('mysql');
require('dotenv').config();
console.log(process.env.DB_NAME);
console.log(process.env.DB_IP);
console.log(process.env.DB_PASSWORD);

/*
const pool = mysql.createPool({
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	host: process.env.DB_IP,
	port: process.env.DB_PORT,
	// socketPath: process.env.DB_SOCKET_PATH,
	connectTimeout: 100000,
});
*/
const pool = mysql.createPool({
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	host: process.env.DB_IP,
	port: process.env.DB_PORT,
	// socketPath: process.env.DB_SOCKET_PATH,
	connectTimeout: 100000,
});

module.exports = {
	insertNewDuelist: function(duelistId, duelistName) {
		pool.query('INSERT INTO Users(id, name) VALUES(?,?)', [duelistId, duelistName], function(err, result) {
			if (err) {
				return err;
			}
			else {
				return result;
			}
		});
	},
};


/*
const query = 'SELECT * FROM Users';
pool.query(query, (error, results) => {
	if (error) {
		console.log(error);
	}
	if (!results) {
		console.log(results);
		console.log('NOT FOUND!');
	}
	else {
		console.log(results[0]);
	}
});
*/
