var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var dbconnect = require('./db');
var replace = require('./replace');
var writePool=require('./writePool.js');
router.post('/',function(req, res) {
  if(req.session.username)
  {
  var fname=req.body.fname;
  var lname=req.body.lname;
  var address=req.body.address;
  var gcity=req.body.city;
  var gstate=req.body.state;
  var city;
  if(gcity)
  {
    city=replace(gcity);
  }
  else
  {
    city= gcity;
  }
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
  var sessionname=req.session.username;
  console.log('Session name' + sessionname);
    var queryset = "UPDATE login SET ";
    var isChanged = false;

    if(typeof fname != 'undefined') {
    			queryset =queryset+"fname = '"+fname+"' , ";
				isChanged = true;
    		}
    		if(typeof lname != 'undefined') {
    			queryset =queryset+"lname = '"+lname+"' , ";
				  isChanged = true;
    		}
    		if(typeof address != 'undefined') {
    			queryset =queryset+"address = '"+address+"' , ";
				isChanged = true;
    		}
    		if(typeof state != 'undefined') {
    			queryset =queryset+"state = '"+state+"' , ";
				isChanged = true;
    		}
    		if(typeof username != 'undefined') {
                console.log('username'+username);
    			queryset =queryset+"username = '"+username+"' , ";
				isChanged = true;
    		}
			if(typeof zip!= 'undefined') {
    			queryset = queryset+"zip = '"+zip+"' , ";
				isChanged = true;
    		}
    		if(typeof password != 'undefined') {
    			queryset = queryset+"password = '"+password+"' , ";
				isChanged = true;
    		}
			if(typeof city != 'undefined') {
    			queryset = queryset+"city = '"+city+"' , ";
				isChanged = true;
    		}
			if(typeof email != 'undefined') {
    			queryset = queryset+"email = '"+email+"' , ";
				isChanged = true;
    		}


if(isChanged) {
           queryset = queryset.substring(0, queryset.length - 2);
           queryset = queryset+"WHERE username = '"+sessionname+"'";
           console.log(queryset);
           queryset = mysql.format(queryset);
        writePool.getConnection(function(err, dbconnect){
         dbconnect.query(queryset,function(err,rows){
                 if(err)
                 {
                     res.json({"message":"The input you provided is not valid"});
                 }
                   else
                    {
                       res.json({"message":fname +" your information was successfully updated"});
                    }
             });
                       dbconnect.release();
           });


}


}
else
{
res.json({"message":"You are not currently logged in"});
}
});
module.exports = router;
