var port = process.env.PORT || 80;
var express = require("express"),
sql = require("mysql"),
h = require("http"), 
app = express(),

morgan = require("morgan"),
cookie = require('cookie-parser'),
session = require('express-session'),
redis = require("redis").createClient(),
pass = require('passport'),
strategy = require("passport-google-oauth").OAuth2Strategy,
bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookie());
app.use(morgan('dev'));
app.use(function(req, res, next){
	res.header("Access-Control-Allow-Origin","http://www.samdevelopers.cf");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	next();
});
app.use(session({
    secret: "EzT3ha3IT1PbvIn",
    resave: true,
    saveUninitialized: true
}));
app.use(express.static(__dirname + '/static'));
require("./pass.js")(pass,sql,strategy);
app.use(pass.initialize());
app.use(pass.session());
/*app.use(function(req, res, next){
	res.header("Access-Control-Allow-Origin","http://shacs.org");
	//res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	next();
});*/
require("./router.js")(app, pass, redis);
h.createServer(app).listen(port, function(){
	console.log("listen at "+port);
});