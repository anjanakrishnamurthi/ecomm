var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var dbconnect = require('./db');
var readPool=require('./readPool.js');
router.post('/',function(req, res) {

    var asin = req.body.asin;
    var keyword= req.body.keyword;
    var group= req.body.group;

    if(typeof asin ==='undefined' && typeof keyword ==='undefined' && typeof group==='undefined')
      {
         var queryString="SELECT asin,productName FROM products";
      }
    else if(typeof asin ==='undefined' &&  typeof group==='undefined')
      {
           var queryString="SELECT asin,productName FROM products WHERE MATCH (productName, productDescription) against ('\"+"+keyword+"\"' in boolean mode)";
      }
    else if(typeof keyword ==='undefined' &&  typeof group==='undefined')
        {
             var queryString='SELECT asin,productName FROM products WHERE asin='+ mysql.escape(asin);
        }
    else if(typeof asin==='undefined' && typeof keyword==='undefined')
            {
              var queryString = 'SELECT asin,productName FROM products WHERE groups='+ mysql.escape(group);
            }
    else if(typeof asin === 'undefined')
        {
             var queryString="SELECT asin,productName FROM products WHERE match (productName,productDescription) against ('\"+"+keyword+"\"' in boolean mode) AND groups="+ mysql.escape(group)+"";
        }
    else if(typeof keyword==='undefined')
        {
             console.log('I am here');
             var queryString = "SELECT asin,productName FROM products WHERE asin="+ mysql.escape(asin)+" AND groups="+ mysql.escape(group)+"";
        }
    else if(typeof group === 'undefined' )
        {
                 var queryString="SELECT asin,productName FROM products WHERE match (productName,productDescription) against ('\"+"+keyword+"\"' in boolean mode)";
        }
    else
        {
          var queryString = "SELECT asin,productName FROM products WHERE asin="+ mysql.escape(asin)+" AND match (productName,productDescription) against ('\"+"+keyword+"\"' in boolean mode) AND groups="+ mysql.escape(group)+"";
        }
    console.log(queryString);
    readPool.getConnection(function(err, dbconnect){
    dbconnect.query(queryString,function(err, rows) {
      if(err)
      {
        throw(err);
      }
      if (rows.length == 0)
      {
        res.json({"message":"There are no products that match that criteria"});
      }
      else
      {
        res.json({"product":rows});
      }

 	  });
          dbconnect.release();
  });

});//end router
module.exports = router;
