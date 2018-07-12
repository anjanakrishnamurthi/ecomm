var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var dbconnect = require('./db');
var writePool=require('./writePool.js');
router.post('/',function(req, res) {
if(req.session.username)
{
      var data = req.body.products;
      console.log(data);
      var values="";
      var queryVal="select productName from products where asin in (";
      var username = req.session.username;
      console.log(data.length);
      var  arr = uniqurArray(data);
      function uniqurArray(array){
              var a = array.concat();
             for(var i=0; i<a.length; i++) {
                 for(var j=i+1; j<a.length; j++) {
                     if(a[i].asin === a[j].asin){
                         a.splice(j--, 1);
                     }
                 }
             }

             return a;
         }
          console.log(arr);

      for (var i = 0; i < data.length; i++)
        {
          values[i]=data[i].asin;
          if(i>0)
          {
          queryVal+=',';
          }
          queryVal+="'"+data[i].asin+"'";
        }
        queryVal+=")";
        console.log(queryVal);
        writePool.getConnection(function(err, dbconnect){
        dbconnect.query(queryVal,function(err, rows)
        {
            if(err)
            {
                  console.log(err);
            }
            else if(rows.length!=arr.length)
            {
                res.json({"message":"There are no products that match that criteria"});
            }
            else
            {
                var temp=true;
                var result_temp=true;
                var queryStr="insert into shophistory (username,asin) values";

                for (var i = 0; i < data.length; i++)
                      {
                        values[i]=data[i].asin;
                        if(i>0)
                        {
                        queryStr+=',';
                        }
                        queryStr+="('"+username+"','"+data[i].asin+"')";
                      }

                      dbconnect.query(queryStr,function(err, rows)
                      {
                        if(err)
                        {
                              console.log(err);
                        }
                        else
                        {
                            res.json({"message":"The action was successful"});
                            for(var i=0;i<arr.length-1;i++)
                            {
                              for(var j=i+1;j<arr.length;j++)
                              {
                                for(var k=j-1;k>=0;k--)
                                {
                                  if(arr[j].asin==arr[k].asin)
                                  {
                                    temp=false;
                                    break;
                                  }
                                }
                                if(temp)
                                {
                                  dbconnect.query('insert into recommendations values (?,?)',[arr[i].asin,arr[j].asin],function(err,rows){
                                  if(err)
                                      {
                                        console.log(err);
                                        result_temp = false;
                                      }
                                    });

                                  dbconnect.query('insert into recommendations values (?,?)',[arr[j].asin,arr[i].asin],function(err,results){
                                    if(err)
                                    {
                                        console.log(err);
                                        result_temp = false;
                                    }
                                    });
                                }
                              }
                            }
                        }
                      });

            }
        });
        dbconnect.release();
		});

}// end session validation
else
{
   res.json({"message":"You are not currently logged in"});
}
});
module.exports = router;
