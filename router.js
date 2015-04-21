var request = require("request");
var path = require("path");
var mime = require("mime");
var async = require("async");
var sql = require("mysql");
var fs = require("fs");
var rng = require("randomstring");
var san = require("google-caja").sanitize;
var login = {
	host: "localhost",
	user: "root",
	password:"Newtonf=gm1m2/r2",
	database : 'pedal'
};
//var db = sql.createConnection(login);
module.exports = function(app, pass, redis){
	app.get("/", homeRedirect, function(req,res){
		//if(req.isAuthenticated) res.redirect("/editor");
		res.sendFile('landing.html', { root: __dirname + "/static" });
	});
	app.get("/editor", isLoggedIn, function(req,res){
		res.sendFile("editor.html",  { root: __dirname + "/static" });
	});
	app.get("/dash",isLoggedIn, function(req, res){
		res.sendFile("dash.html",  { root: __dirname + "/static" });
	});
	/*app.post("/edit/:id",isLoggedIn, function(req,res){
		
	});*/
	app.get("/auth", pass.authenticate("google",{
		scope: ["profile","email"]
	}));
	app.get("/auth/callback", pass.authenticate("google",{
		successRedirect:"/dash",
		failureRedirect:"/"
	}));
	app.get("/auth/logout",function(req, res){
		req.logout();
		res.redirect("/");
	});
	app.get("/api/user/list", isLoggedIn, function(req, res){
		var db = sql.createConnection(login);
		var ID  = req.session.passport.user.id;
		// name = req.session.passport.user.displayName
		var qs = "SELECT * FROM board WHERE uid = '"+ID+"';";
		db.query(qs, function(err, data){
			if(err) throw err;
			db.end();
			res.end(JSON.stringify(data));
		});
		//id mongoad token name uid
	});
	app.post("/api/user/new", isLoggedIn, function(req,res){
		var db = sql.createConnection(login);
		var d = req.body;
		var t = rng.generate(5);
		var ID  = req.session.passport.user.id;
		var qa = "INSERT INTO board VALUES(NULL, '" + t + "', '" + d.name + "', '" + ID +"');";
		//console.log(qa);
		db.query(qa, function(err, data){
			if(err) throw err;
			db.end();
			redis.hset(t,"view","0",redis.print);
			redis.hset(t,"links","0",redis.print);
			redis.hset(t,"public","0",redis.print);
			// CREATE CORRESPONDING REDIS HASTABLE. KEY is TOKEN.

			res.end("200");
		});
	});
	app.put("/api/user/delete/:id",isLoggedIn, function(req, res){
		if(req.params.id.match(/^[a-zA-Z0-9]*$/)){
			var ID  = req.session.passport.user.id;
			var db = sql.createConnection(login);
			var qa = "SELECT * FROM board WHERE uid = '" + ID +"' AND token = '" + req.params.id + "' ;"
			db.query(qa, function(err,data){
				if(err) throw err;
				if(data[0] != null){
					var qd = "DELETE FROM board WHERE token = '" + req.params.id +"';";
					db.query(qd,function(errd,deta){
						if(errd) throw errd;
					    db.end();
					    redis.del(req.params.id,redis.print);
					    res.sendStatus(200);
					});
				}
				else {
					db.end();
					res.send(503,"NOT PERMITTED");
				}
			});
		}
		else { res.send(503, "BAD REQUEST")}
	});

};
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    else res.redirect('/');
}
function homeRedirect(req, res, next){
	if(req.isAuthenticated()) res.redirect("/dash");
	else return next();
}