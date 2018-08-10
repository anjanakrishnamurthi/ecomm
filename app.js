var express = require('express');
var app = express();
var session=require('express-session');
var http=require('http');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var responseTime = require('response-time');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var login = require('./routes/login');
var registerUser = require('./routes/register');
var logout = require('./routes/logout');
var updateInfo = require('./routes/updateInfo');
var addProducts=require('./routes/addProducts');
var modifyProduct=require('./routes/modifyProduct');
var viewUsers=require('./routes/viewUsers');
var viewProducts=require('./routes/viewProducts');
var buyProducts=require('./routes/buyProducts');
var productsPurchased=require('./routes/productsPurchased');
var getRecommendations=require('./routes/getRecommendations');

app.use(session({
  secret: 'Anjana060492',
	resave: true,
	rolling:true,
	saveUninitialized:true,
  cookie:{maxAge: 90000}
}))

app.set('view engine', 'ejs');

app.use('/login', login);
app.use('/registerUser',registerUser);
app.use('/logout',logout);
app.use('/updateInfo',updateInfo);
app.use('/addProducts',addProducts);
app.use('/modifyProduct',modifyProduct);
app.use('/viewUsers',viewUsers);
app.use('/viewProducts',viewProducts);
app.use('/buyProducts',buyProducts);
app.use('/productsPurchased',productsPurchased);
app.use('/getRecommendations',getRecommendations);


//require('http').createServer(function(req,res){
//	console.log("I am listening at 3000")
	//res.writeHead(200);
//}).listen(3000);


console.log("Iam here");
app.get('/', function(req, res) {
    res.render('login');
});
