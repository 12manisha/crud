

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

mongoose.connect("mongodb://0.0.0.0:27017/wikidb", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);


/////////////////////////////ALL ARTICLES/////////////////////

app.route("/articles")

.get(
    function(req,res){
        Article.find().then(foundArticles => {
            res.send(foundArticles);
        })
    })

.post(
    function(req,res){
        console.log(req.body.title);
        console.log(req.body.content);
    
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save().then(() => {
            console.log("Succesfully added");
        }).catch(function(err) {
            console.log(err);
        })
    })

.delete(
    function(req,res){
    Article.deleteMany().then(function(){
        console.log("Deleted successfully");
    }).catch(function(err){
        console.log(err);
    })
});
////////////////////////////////////////SPECIFIC ARTICLE////////////////////////


app.route("/articles/:articleTitle")

.get(
    function(req,res){
        Article.findOne({title: req.params.articleTitle }).then(foundArticles =>{
            res.send(foundArticles)
        }).catch(function(err){
            res.send("NO articles found")
        });
    })

.put(
    function(req,res){
        Article.updateOne(
            {title: req.params.articleTitle}, 
            {title: req.body.title, content: req.body.content})
            .then( () => {
                res.send("Successfully updated")
            }).catch(function(err){
                res.send(err)
            })
            
            })

.patch(
    function(req,res){
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body})
            .then( function() {
                res.send("successfully updated")
            }).catch(function(err){
                res.send(err)
            })
        
    })

.delete(
    function(req,res){
        Article.deleteOne({title: req.params.articleTitle}).then(function(){
            res.send("Successfully deleted")
        }).catch((err) => {
            res.send(err)
        })
    }
)

//TODO
// app.get('/articles', function(req,res)  {
//     Article.find().then(foundArticles => {
//         res.send(foundArticles);
//     })
// })
// app.post('/articles', function(req,res){
//     console.log(req.body.title);
//     console.log(req.body.content);

//     const newArticle = new Article({
//         title: req.body.title,
//         content: req.body.content
//     });
//     newArticle.save(function(err){
//         if(!err){
//             res.send("Successfully added a new article");
//         }else{
//             res.send(err);
//         }
//     });
// });
// app.delete('/articles', function(req,res) {
//     // Function call
// // Deleting all users whose age >= 15
// Article.deleteMany().then(function(){
//     console.log("successfully deleted"); // Success
// }).catch(function(error){
//     console.log(error); // Failure
// });
// })

app.get("/articles");
app.post("/articles");
app.delete("/articles");


app.listen(3000, function() {
  console.log("Server started on port 3000");
});