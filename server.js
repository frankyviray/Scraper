var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var exphbs = require("express-handlebars")




var PORT = process.env.PORT || 3000;


var app = express();


app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


var databaseUri = "mongodb://localhost/mongoHeadlines";

if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
    mongoose.connect(databaseUri);
}



require("./routes/api-scrape-routes.js")(app);
require("./routes/api-saved-routes.js")(app);



app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});