var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");
var resultArray = [];
module.exports = function(app) {

  app.get("/scrape", function(req, res) {

    axios.get("https://www.reddit.com/").then(function(response) {
      var $ = cheerio.load(response.data);

      $("div.thing").each(function(i, element) {
        var result = {};

        result.title = $(element).find("div.entry.unvoted")
          .find("div.top-matter").find("a.title").text();
        result.link = "https://www.reddit.com" +
          $(element).find("div.entry.unvoted")
          .find("div.top-matter").find("a.title").attr("href");

        db.Article.create(result)
          .then(function(dbArticle) {
            resultArray.push(dbArticle);
          })
          .catch(function(err) {
            res.json(err);
          });
      });
    });
    res.end();
  });

  app.get("/", function (req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
 
      res.render("index", {array: dbArticle} );
    })
    .catch(function(err) {
     
      res.json(err);
    });
  });

  app.get("/articles/:id", function (req, res) {
    db.Article.findOne({
      _id: req.params.id
    }).populate("comments")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {

      res.json(err);
    });
  });

  app.post("/articles/:id", function (req, res) {

    db.Comments.create(req.body)
      .then(function (dbComment) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { comments: dbComment._id }, { new: true });
      }).then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
 
        res.json(err);
      });
  });

  app.delete("/articles/:id", function (req, res) {
    console.log(req.params.id);
    db.Comments.remove({_id: req.params.id}, function (data) {
      res.json(data);
    });
  });

};