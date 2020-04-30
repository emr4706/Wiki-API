//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// mongodb database connect
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

// creat database schema
const articleSchema = {
    title: String,
    content: String
};

// creat database model 
const Article = mongoose.model("Articel", articleSchema);

// // read database with GET method
// app.get("/articles", (req, res) => {
//     Article.find((err, foundArticles) => {
//         if (!err) {
//           res.send(foundArticles);  
//         } else {
//             res.send(err);
//         }
//     });
// });
// // crate a new article in database with POST method

// app.post("/articles", (req, res) => {
//     const newArticle = new Article({ // it created with the postman .....
//         title: req.body.title,
//         content: req.body.content
//     });
//     newArticle.save({}, function(err) {
//         if (!err) {
//             res.send("successfully added a new article.");
//         } else {
//             res.send(err);
//         }
//     });
// });

// // delete all articles in database with DELETE method

// app.delete("/articles", (req, res) => {
//     Article.deleteMany({}, (err) => {
//         if (!err) {
//             res.send("successfully deleted.");
//         } else {
//             res.send(err);
//         }
//     });
// });

///////////// Request targeting articles ////////////////////////

app.route("/articles")
.get((req, res) => {
    Article.find((err, foundArticles) => {
        if (!err) {
          res.send(foundArticles);  
        } else {
            res.send(err);  
        }
    });
})

.post((req, res) => {
    const newArticle = new Article({ // it created with the postman .....
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save( function (err) {
        if (!err) {
            res.send("successfully added a new article.");
        } else {
            res.send(err);
        }
    });
})

.delete((req, res) => {
    Article.deleteMany( {}, (err) => {
        if (!err) {
            res.send("successfully deleted.");
        } else {
            res.send(err);
        }
    });
});

///////////// Request targeting a specific  article ////////////////////////
app.route("/articles/:articleTitle")
.get( (req, res) => {
    Article.findOne({ title: req.params.articleTitle}, (err, foundArticle) => {
        if(foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No article matching that title was found.")
        }
    });
})

.put( (req, res) => { // PUT method chanced all of the article
    Article.update(
        { title: req.params.articleTitle },
        { title: req.body.title, content: req.body.content },
        { overwrite: true },
        (err) => {
            if (!err) {
                res.send("Successfully updated the article.")
            }
        }
    );
})

.patch( (req, res) => { // PATCH method chanced just specific value of the article
    Article.update(
        { title: req.params.articleTitle},
        { $set: req.body },
        (err) => {
            if (!err) {
                res.send("Successfully updated the article.");
            } else {
                res.send(err);
            }
        }
    );
})

.delete( (req, res) => {
    Article.deleteOne(
        { title: req.params.articleTitle },
        (err) => {
            if (!err) {
                res.send("Successfully deleted the corresponding article.");
            } else {
                res.send(err);
            }
        }
    );
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});



