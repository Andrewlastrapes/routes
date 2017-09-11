
// Structure a series of possible responses 
// depending on the url requested in the browser

// 

var express = require("express");
var app = express();
var handlebars = require("express-handlebars")
var mongoose = require("mongoose")

// .create({defaultLayout:"main"});

app.engine("handlebars", handlebars({defaultLayout: "main"}));
app.set("view engine", "handlebars")
app.use(require("body-parser").urlencoded({
	extended: true}));


var credentials = require('./credentials.js');
app.use(require('cookie-parser')(credentials.cookieSecret)); 

var formidable = require("formidable")


app.get("/", function(req, res){
	res.render("home");
});

app.get("/about", function(req, res){
	res.render("about")
})


mongoose.connect("mongodb://127.0.0.1:27017/newData")
var Schema = mongoose.Schema;
var userDataSchema = new Schema ({
	title: String,
	content: String,
	author: String
});


var UserData = mongoose.model('UserData', userDataSchema);


app.get("/get-data", function(req, res, next){
	UserData.find()
		.then(function(doc){
			res.render("users", {items : doc});
		});
});

app.post("/insert", function(req, res, next){
	var item = {
		title: req.body.title,
		content: req.body.content,
		author: req.body.author
	}
})


app.post("/get-data", function(req, res, next){
	var items = {
		title: req.body.title,
		content: req.body.content,
		author: req.body.author
	}
	var data = new UserData(item)
	data.save();
	res.redirect('/')


})

app.get("/contact", function(req, res){
	res.render("contact", {csrf: 'CSRF token here'});
});

app.get('/thankyou', function(req, res){
	res.render("thankyou")
})

app.post("/process", function(req, res){
	console.log("Form" + req.query.form)
	console.log("CSRF token: " + req.body._csrf)
	console.log("Email : " + req.body.email);
	res.redirect(303, "/thankyou")
})


app.get("/file-upload", function(req, res){
	var now = new Date();
	res.render("file-upload", {
		year: now.getFullYear(),
		month: now.getMonth() 
	})
});

app.get("file-upload/:year/:month",
	function(req, res){
		var form = new formidable.IncomingForm();
		form.parse(req, function(err, fields, file){
			if(err)
				return res.redirect(303, '/error');
			console.log("Received File")
			console.log(file);
			res.direct(303, "/thankyou")
		})
	})

app.get("/cookie", function(req, res){
	res.cookie("username", "Andrew Lastrapes", {expire: new Date() + 9999}).send('username has the value of Andrew Lastrapes');
});

app.get("listcookies", function(req, res){
	console.log("Cookies : ", req, cookies);
	res.send("Look in the console for cookies.")
});

app.get("/deletecookie", function(req, res){
	res.clearCookie('username')
	res.send("username Cookie Deleted")
});

app.use(function(req, res){
	res.type("text/html");
	res.status(404);
	res.render("404")
});


app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render("500");
})




app.set("port", process.env.PORT || 3005)

app.use(express.static(__dirname + "../public"));

app.listen(app.get("port"), function(){
	console.log("Listening on port " + app.get("port"))
});