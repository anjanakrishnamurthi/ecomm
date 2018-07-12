var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var dbconnect = require('./db');
var readPool=require('./readPool.js');
var app = express();

router.post('/',function(req, res) {

var parameters  = [req.body.username, req.body.password];
readPool.getConnection(function(err, dbconnect){
 dbconnect.query('select * from login where username=? and password=?',parameters,function(err, rows){
   if(err)
   {
     console.log("My SQL Error ",err );
   }

   else if(!err && rows.length>0)
   {
     console.log('Connection established');
     req.session.username = rows[0].username;
     console.log(req.session.username);
     if(req.session.username == 'jadmin')
     {
       req.session.role = 'admin';
       console.log('role set:admin');
     }
     else
     {
       req.session.role = 'customer';
       console.log('role set:customer');
     }
     res.json({'message':'Welcome '+rows[0].fname});
   }
   else
   {
     console.log('Enter error loop');
     res.json({'message':'There seems to be an issue with the username/password combination that you entered'});
   }

});
dbconnect.release();
});
});

module.exports = router;
