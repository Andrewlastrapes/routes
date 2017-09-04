
// Structure a series of possible responses 
// depending on the url requested in the browser

// 

var express = require("express");
var app = express();
var handlebars = require("express-handlebars")

// .create({defaultLayout:"main"});

app.engine("handlebars", handlebars({defaultLayout: "main"}));
app.set("view engine", "handlebars")
app.use(require("body parser").urlencoded({
	extended: true}));
}));

var credentials = require('/credentials.js');
app.use(require('cookie-parser')credentials.cookieSecret));

var formidable = require("formidable")


app.get("/", function(req, res){
	res.render("home");
});

app.get("/about", function(req, res){
	res.render("about")
})

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

app.get("/contact", function(req, res){
	res.render("contact")
});

app.set("port", process.env.PORT || 3001)

app.use(express.static(__dirname + "../public"));

app.listen(app.get("port"), function(){
	console.log("Listening on port " + app.get("port"))
});