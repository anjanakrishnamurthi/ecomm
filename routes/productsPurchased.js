var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var dbconnect = require('./db');
var readPool=require('./readPool.js');
router.post('/',function(req, res) {
  if(req.session.username)
  {
      if(req.session.role=='admin')
      {
        var username=req.body.username;
        console.log(username);
        var queryStr="select p.productName as productName,count(*) AS quantity from shophistory ph join products p on ph.asin=p.asin group by ph.username,p.productName having ph.username='"+username+"'";
        readPool.getConnection(function(err, dbconnect){
        dbconnect.query(queryStr,function(err,rows,results)
        {
          if(err)
          {
            console.log(err);
          }
          else if(rows.length>0)
          {
            res.json({"message":"The action was successful","products":rows});
          }
          else
          {
            res.json({"message":"There are no users that match that criteria"});
          }

        });
        dbconnect.release();
      });
      }
      else
      {
        res.json({"message":"You must be an admin to perform this action"});
      }

}
else
    {
          res.json({"message":"You are not currently logged in"});
    }

});
module.exports = router;
