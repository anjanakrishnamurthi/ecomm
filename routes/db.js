var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'edisassignmentone.cvoay42puhxi.us-east-1.rds.amazonaws.com',
    user     : 'admin',
    password : '98944svk',
    database : 'edisecommerce'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('I am connected');
});

module.exports =connection;
