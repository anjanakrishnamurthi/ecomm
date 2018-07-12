var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var dbconnect = require('./db');
var readPool=require('./readPool.js');
router.post('/',function(req, res) {
if(req.session.username)
{
    var asin=req.body.asin;
    readPool.getConnection(function(err, dbconnect){
    dbconnect.query('select * from recommendations where bought=?',asin,function(err,rows){
    if(err)
    {
      console.log(err);
    }
    else if(rows.length>0)
    {
        dbconnect.query('select asin from ( select alsobought as asin , count(*) as cnt from recommendations where bought=? group by alsobought order by cnt desc limit 5) as temp',asin,function(err, rows)
        {
        res.json({"message":"The action was successful", "products":rows});
        });
    }
    else
    {
      res.json({"message":"There are no recommendations for that product"});
    }
    });
    dbconnect.release();
  });
}
else
{
  res.json({"message":"You are not currently logged in"});
}
});
module.exports = router;
