var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var dbconnect = require('./db');
var readPool=require('./readPool.js');

router.post('/',function(req, res) {

    var fname = req.body.fname;
    var lname= req.body.lname;

    if(req.session.username)
    {
          if(req.session.role=='admin')
      {
        var fname=req.body.fname;
        var lname=req.body.lname;

           if(typeof fname === 'undefined' && typeof lname =='undefined')
           {
             var queryString="SELECT fname,lname,username FROM login";
           }
           else if(typeof lname === 'undefined')
           {
             var queryString="select fname,lname,username from login where fname LIKE '%"+fname+"%'";
           }
           else if(typeof fname === 'undefined')
           {
                var queryString="SELECT fname,lname,username FROM login where lname LIKE '%"+lname+"%'";
           }
           else if(fname.length==0||lname.length==0)
           {
             var queryString="SELECT fname,lname,username FROM login";
           }
           else
           {
          	 var queryString="SELECT fname,lname,username FROM login WHERE fname LIKE '%"+fname+"%' AND lname LIKE '%"+ lname +"%'";
           }

           console.log(queryString);
           readPool.getConnection(function(err, dbconnect){
           dbconnect.query(queryString,function(err, rows)
            {
              if(rows.length==0)
              {
                  res.json({"message":"There are no users that match that criteria"});
              }
              else
                {
                    res.json({"message":"The action was successful",'user':rows});
                }
            });
            dbconnect.release();
          });

      }// end role validation
      else
      {
        res.json({"message":"You must be an admin to perform this action"});

      }
    }// end session validation
    else
    {
      res.json({"message":"You are not currently logged in"});
    }

});//end router
module.exports = router;
