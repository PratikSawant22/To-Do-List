const express = require("express");
let ejs = require('ejs');
const  bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const { static } = require("express");

mongoose.connect("mongoDB://localhost:27017/todolistDB",{useNewUrlParser:true});


// BEFORE ADDING DATABASE
// var items = [ "buy food" , "cook food" , "eat food"];
// var workitems =[];


const itemSchema = {
    name:String
};

const Item = mongoose.model("item",itemSchema);

const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.set("view engine","ejs");


app.get("/",function(req,res){

    let day = date.getDate();
    res.render("list",{listTitle : day,newitemlists : items})

});

app.post("/",function(req,res){
    let item = req.body.newitem;
    if (req.body.list === "work") {
        workitems.push(item);
        res.redirect("/work")
    }
    else{
        items.push(item);
        res.redirect("/");
    }
   
})

app.get("/work",function(req,res){
    res.render("list",{listTitle : "work",newitemlists :workitems})
});
app.get("/about",function(req,res){
    res.render("about")
})

app.listen(3000,function(){
    console.log("server is running on port 3000.......");
})