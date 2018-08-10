
router.post('/',function(req, res) {
  console.log("Sending response");
  res.writeHead(200);  
});

module.exports=router;
