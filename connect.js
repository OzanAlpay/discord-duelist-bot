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
	insertNewDuelist: function(duelistId, duelistName, errorCallback, callback) {
		pool.query('INSERT INTO Users(id, name) VALUES(?,?)', [duelistId, duelistName], function(err, result) {
			if (err) {
				errorCallback();
			}
			else {
				console.log(result);
				callback();
			}
		});
	},
	getDuelistById: function(duelistId, errorCallback, callback) {
		console.log('getDuelistById function called!');
		pool.query('SELECT * FROM Users WHERE id = ?', [duelistId], function(err, result) {
			console.log('Get Duelist BY ID Called!');
			if (err) {
				errorCallback();
				console.log('ERROR!');
				console.log(err);
				return -1;
			}
			else {
				callback(result);
			}
		});
	},
	registerDuelRecord: function(firstDuelistId, secondDuelistId, duelresult, errorCallback, successCallback) {
		pool.query('INSERT INTO Duelrecords(Firstduelist, Secondduelist, Result) VALUES(?,?,?)', [firstDuelistId, secondDuelistId, duelresult], function(err, result) {
			if (err) {
				console.log('ERROR OCCURED DURING INSERTING Duelrecord!');
				console.log(err);
				errorCallback();
			}
			else {
				console.log('RESULT INSERTED!');
				console.log(result);
				successCallback(result);
			}
		});
	},
	getDuelRecordsBetweenTwoUsers: function(firstDuelistId, secondDuelist, errorCallback, successCallback) {
		pool.query('SELECT * FROM Duelrecords WHERE Firstduelist = ? && Secondduelist = ?', [firstDuelistId, secondDuelist], function(err, result) {
			if (err) {
				console.log('ERROR OCCURED!');
				errorCallback();
			}
			else {
				console.log('SUCCESS!');
				successCallback(result);
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
