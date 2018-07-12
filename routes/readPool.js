var mysql = require('mysql');

var readpool = mysql.createPool({
	connectionLimit: 25,
	host: 'edisassignmentone.cvoay42puhxi.us-east-1.rds.amazonaws.com',
	port: '3306',
	user: 'admin',
	password: '98944svk',
	database: 'edisecommerce'
});

module.exports = readpool
