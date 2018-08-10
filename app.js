var express = require('express');
var app = express();
var session=require('client-sessions');
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

//app.set('view engine', 'ejs');

//app.use('/',healthCheck);
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


app.get('/sendecho.html', function (req, res) {
	console.log("I am here");
  res.send(200);
  res.end();
});

const server = http.createServer(app);
server.listen(3000, function listening(req,res) {
  console.log('Listening on %d', server.address().port);
});

app.get('/', function(req, res) {
    res.render('login');
});
