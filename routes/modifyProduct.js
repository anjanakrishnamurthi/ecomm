var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var dbconnect = require('./db');
var writePool=require('./writePool.js');

router.post('/',function(req, res) {
    var asin = req.body.asin;
    var productName= req.body.productName;
    var productDescription= req.body.productDescription;
    var group= req.body.group;

    if(req.session.username)
    {
      if(req.session.role=='admin')
      {
        var queryset="UPDATE products SET "+" ";
        if(typeof asin === "undefined" || typeof productName === "undefined" || typeof productDescription === "undefined"
         || typeof group === "undefined" || asin.length == 0 || productName.length ==0 ||productDescription.length == 0)
        {
          res.json({'message':'The input you provided is not valid'});
        }
        else
        {
          queryset+="productName='"+productName+"'"+",";
          queryset+="productDescription='"+productDescription+"'"+",";
          queryset+="groups='"+group+"'"+",";
        }

      var finalset=queryset.substr(0,queryset.length-1);

      var resultset=finalset+"WHERE asin="+asin+";";

      console.log(resultset);
       writePool.getConnection(function(err, dbconnect){
      dbconnect.query(resultset,function(err, rows, fields)
      {
          if (err)
          {
          res.json({'message':'The input you provided is not valid'});
          }
         else if (rows.length == 0)
         {
           res.json({'message':'The input you provided is not valid'});
         }
         else
          {
          res.json({'message':productName+' was successfully updated'});
          }
        });
        dbconnect.release();
      });
      }// end role validation
      else
      {
        res.json({'message':'You must be an admin to perform this action'});
      }
    }// end session validation
    else
    {
      res.json({'message':'You are not currently logged in'});
    }

});//end router
module.exports = router;
