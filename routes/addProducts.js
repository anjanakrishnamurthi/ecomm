var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var dbconnect = require('./db');
var writePool=require('./writePool');
router.post('/',function(req, res) {

var asin = req.body.asin;
var productName= req.body.productName;
var productDescription= req.body.productDescription;
var group= req.body.group;


if(req.session.username)
{
    if(req.session.role=='admin')
    {
      if(typeof asin === "undefined" || typeof productName === "undefined" || typeof productDescription === "undefined" || typeof group === "undefined")
      {
        res.json({"message":"The input you provided is not valid"});
      }
      else
      {
        var parameters = {
          asin:req.body.asin,
          productName:req.body.productName,
          productDescription:req.body.productDescription,
          groups:req.body.group,
         };
         writePool.getConnection(function(err, dbconnect){
         dbconnect.query("INSERT INTO products set ? ",parameters,function(err, rows, fields) {
           if (err)
             {
               console.log(err);
               res.json({"message":"The input you provided is not valid"});
             }
             else
             {
               res.json({"message":productName+" was successfully added to the system"});
             }

         });
         dbconnect.release();
       });
      }
    }//end if
    else
    {
      res.json({"message":"You must be an admin to perform this action"});
    }//end else

}//end session validation
else
{
  res.json({"message":"You are not currently logged in"});
}





}); //end of router
module.exports = router;
