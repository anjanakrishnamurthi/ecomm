var express = require('express');
var router = express.Router();

router.post('/',function(req, res) {

  if(req.session.username)
	{
		req.session.destroy();
	   res.json({'message':'You have been successfully logged out'});
	}
	else
	{
		res.json({'message':'You are not currently logged in'});
	}

});

module.exports = router;
