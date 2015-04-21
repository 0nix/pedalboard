var login = {
	host: "localhost",
	user: "root",
	password:"Newtonf=gm1m2/r2",
	database : 'pedal'
	};
/**
	DESCRIBE user;
	+---------+--------------+------+-----+---------+-------+
	| Field   | Type         | Null | Key | Default | Extra |
	+---------+--------------+------+-----+---------+-------+
	| name    | varchar(255) | YES  |     | NULL    |       |
	| email   | varchar(900) | YES  |     | NULL    |       |
	| service | varchar(20)  | YES  |     | NULL    |       |
	| id      | varchar(128) | NO   | PRI | NULL    |       |
	+---------+--------------+------+-----+---------+-------+
	**/
module.exports = function(pass, sql, strategy){	
	pass.serializeUser(function(user, done){
		done(null, user);
	});
	pass.deserializeUser(function(obj, done){
		done(null,obj);
	});
	pass.use(new strategy({
		clientID: "300863294017-p1q89jnvb63vjn1g89bib5a805snd4li.apps.googleusercontent.com",
		clientSecret: "i5zUedT9nhrOf42ZYTOrmKmz",
		callbackURL: "http://www.samdevelopers.cf/auth/callback"
	},function(token, refreshToken, profile, done){
		process.nextTick(function(){
			//console.log(profile);
			var token = profile.id;
			var name = profile.displayName;
			var email = profile.emails[0].value;
			var db = sql.createConnection(login);
			var qsearch = "SELECT name FROM user WHERE id = "+token+";";
			db.connect();
			db.query(qsearch, function(err,data){
				if(err) throw err;
				//console.log(data);
				if(data[0] == null){
					//console.log("EXECUTING NEW USER ENTRY");
					var qnew = "INSERT INTO user (name, email, service, id) VALUES ('"+name+"', '"+email+"', 'google', '"+token+"');";
					db.query(qnew, function(err,deta){
						if(err) throw err;
						db.end();
						return done(null, profile);
					});
				}
				else{
					db.end();
					return done(null, profile);
				}
			});
		});
	}));

}