var express = require('express');
var mysql = require('mysql');
var dbconnect = require('./db');
var replace = require('./replace');
var writePool=require('./writePool.js');

var router = express.Router();

router.post('/',function(req, res) {

var fname=req.body.fname;
var lname=req.body.lname;
var address=req.body.address;
var gcity=req.body.city;
var city;
if(gcity)
{
  city=replace(gcity);
}
else
{
  city= gcity;
}

var gstate=req.body.state;
var state;
if(gstate)
{
  state=replace(gstate);
}
else
{
  state=gstate;
}

var zip=req.body.zip;
var email=req.body.email;
var username=req.body.username;
var password=req.body.password;

if(typeof fname === "undefined" || typeof lname === "undefined" || typeof address === "undefined" || typeof city === "undefined"
|| typeof state === "undefined" || typeof zip === "undefined" || typeof email === "undefined" || typeof username === "undefined"
|| typeof password === "undefined")
{
  res.json({'message':'The input you provided is not valid'});
}
else if(state.length<2)
{
  res.json({'message':'The input you provided is not valid'});
}
else
{
username= req.body.username;
      var parameters = {
        fname:fname,
        lname:lname,
        address:address,
        city:city,
        state:state,
        zip:zip,
        email:email,
        username:username,
        password:password,
       };
       writePool.getConnection(function(err, dbconnect){
      dbconnect.query("INSERT INTO login set ? ",parameters,function(err, rows, fields) {
        if (err)
          {
            res.json({'message':'The input you provided is not valid'});
          }
          else
          {
            res.json({'message':req.body.fname+' was registered successfully'});
          }

      });
      dbconnect.release();
    });
}
});
module.exports = router;
