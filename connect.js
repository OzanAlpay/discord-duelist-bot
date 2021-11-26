const mysql = require('mysql');
require('dotenv').config();

const pool = mysql.createPool({
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	host: process.env.DB_IP,
	port: process.env.DB_PORT,
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
		pool.query('SELECT * FROM Users WHERE id = ?', [duelistId], function(err, result) {

			if (err) {
				errorCallback();
				console.log('ERROR!');
				console.log(err);
			}
			else {
				callback(result);
			}
		});
	},
	registerDuelRecord: function(firstDuelistId, secondDuelistId, firstDuelistScore, secondDuelistScore, guildid, errorCallback, successCallback) {
		pool.query('INSERT INTO Duelrecords_' + guildid + '(Firstduelist, Secondduelist, Firstduelistscore, Secondduelistscore) VALUES(?,?,?,?)',
			[firstDuelistId, secondDuelistId, firstDuelistScore, secondDuelistScore, guildid], function(err, result) {
				if (err) {
					console.log('ERROR OCCURED DURING INSERTING Duelrecord!');
					console.log(err);
					errorCallback();
				}
				else {
					successCallback(result);
				}
			});
	},
	getDuelRecordsBetweenTwoUsers: function(firstDuelistId, secondDuelist, guildid, errorCallback, successCallback) {
		pool.query('SELECT * FROM Duelrecords_' + guildid + ' WHERE Firstduelist = ? && Secondduelist = ?', [firstDuelistId, secondDuelist], function(err, result) {
			if (err) {
				console.log('ERROR OCCURED!');
				console.log(err);
				errorCallback();
			}
			else {
				successCallback(result);
			}
		});
	},
	createRequiredTablesForGuild: function(guildid) {
		pool.query(`CREATE TABLE IF NOT EXISTS Leaderboard_${guildid}(userid bigint PRIMARY KEY, wins int DEFAULT 0, loses int DEFAULT 0, score int DEFAULT 0,FOREIGN KEY(userid) REFERENCES Users(id));`,
			function(err, result) {
				if (err) {
					console.log('Error While Creating Required Leaderboard table for guild id = ' + guildid);
					console.log(err);
				}
				else {
					console.log('Create Leaderboard table for guildid = ' + guildid + ' is  = ' + result);
					pool.query(`CREATE TABLE IF NOT EXISTS Duelrecords_${guildid}(id int(11) PRIMARY KEY AUTO_INCREMENT,
				Firstduelist bigint, 
				Secondduelist bigint, 
				Firstduelistscore int, 
				Secondduelistscore int, 
				date timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
				FOREIGN KEY(Firstduelist) REFERENCES Users(id), 
				FOREIGN KEY(Secondduelist) REFERENCES Users(id));`,
					function(createTableErr, createTableResult) {
						if (createTableErr) {
							console.log('Error While Creating Required Duelrecords Table for guild = ' + guildid);
							console.log(createTableErr);
						}
						else {
							console.log('Create Duelrecords table for guildid = ' + guildid + ' is  = ' + createTableResult);
						}
					});
				}
			});
	},
	updateLeaderBoard: function(firstDuelistid, secondDuelistid, firstDuelistScore, secondDuelistScore, guildid) {
		// INSERT INTO Leaderboard_787296059290025984 VALUES(668075833780469772,1,0) ON DUPLICATE KEY UPDATE wins=wins+1, loses=loses+2;
		pool.query(`INSERT INTO Leaderboard_${guildid} VALUES(${firstDuelistid}, ${firstDuelistScore}, ${secondDuelistScore})
		ON DUPLICATE KEY UPDATE wins=wins+${firstDuelistScore}, loses=loses+${secondDuelistScore}`, function(err, success) {
			if (err) {
				console.log('Error while updating leaderboard for first user!');
				console.log(err);
			}
			else {
				console.log(success);
				console.log('First Duelist Successfully Updated!, now trying to update second user in db table!');
				pool.query(`INSERT INTO Leaderboard_${guildid} VALUES(${secondDuelistid}, ${secondDuelistScore}, ${firstDuelistScore})
		ON DUPLICATE KEY UPDATE wins=wins+${secondDuelistScore}, loses=loses+${firstDuelistScore}`, function(secondInsertionerr, secondInsertionsuccess) {
					if (secondInsertionerr) {
						console.log('Error While Updating Leaderboard for Second Player');
						console.log(secondInsertionerr);
					}
					else {
						console.log('Leaderboard Updated for Both First and Second Users! ');
						console.log(secondInsertionsuccess);
					}
				});
			}
		});
	},
	getLeaderBoardResults: function(guildid, errorCallback, successCallback) {
		// SELECT u.name, l.wins, l.loses, l.wins - l.loses as Score  FROM Users u INNER JOIN  Leaderboard_787296059290025984 l ON u.id = l.userid ORDER BY Score DESC;
		pool.query(`SELECT u.name, l.wins, l.loses, l.wins - l.loses as Score 
								FROM Users u 
								INNER JOIN Leaderboard_${guildid} l 
								ON u.id = l.userid 
								ORDER BY Score DESC`, function(err, success) {
			if (err) {
				errorCallback(err);
			}
			else {
				successCallback(success);
			}
		});
	},
};
