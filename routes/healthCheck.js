
var express=require('express')
var router = express.Router();

router.post('/',function(req, res) {
  console.log("Sending response");
  res.writeHead(200);  
});

module.exports=router;
