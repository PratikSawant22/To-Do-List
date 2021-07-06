const express = require("express");
let ejs = require('ejs');
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
const {
    static
} = require("express");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

const mdb_username = process.env.MONGODB_USERNAME;
const mdb_password = process.env.MONGODB_PASSWORD;

mongoose.connect("mongodb+srv://" + mdb_username + ":" + mdb_password + "@cluster0.eb7fk.mongodb.net/todolistDB?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to your to do list!"
})
const item2 = new Item({
    name: "Press + to add a new item"
})
const item3 = new Item({
    name: "<== Hit this to delete an item"
})

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    item: [itemSchema]
}

const List = mongoose.model("List", listSchema);


app.get("/", function (req, res) {

    const day = date.getDay();
    Item.find({}, function (err, founditem) {
        if (founditem.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully added default Items to DB.");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {
                listTitle: day,
                newitemlists: founditem
            });
        }
    });

});

app.post("/", function (req, res) {

    const newitem = req.body.newitem;
    const listName = req.body.list;
    const day = date.getDay();

    const newItem = new Item({
        name: newitem
    });

    if (listName === day) {
        newItem.save();
        res.redirect("/");
    } else {
        List.findOne({
            name: listName
        }, function (err, foundList) {
            foundList.item.push(newItem);
            foundList.save();
            res.redirect("/" + listName);
        })
    }
})

app.post("/delete", function (req, res) {
    const checkeditemID = req.body.checkbox;
    const listName = req.body.listName;
    const day = date.getDay();


    if (listName === day) {
        Item.findByIdAndRemove(checkeditemID, function (err) {
            if (!err) {
                console.log("item with ID:" + checkeditemID + " deleted successfully");
                res.redirect("/");
            }
        })
    } else {
        List.findOneAndUpdate({
            name: listName
        }, {
            $pull: {
                item: {
                    _id: checkeditemID
                }
            }
        }, function (err, foundList) {
            if (!err) {
                console.log("successfully deleted an item from " + listName + " list");
                res.redirect("/" + listName);

            } else {
                console.log("error" + err);
            }
        })
    }
});

app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({
        name: customListName
    }, function (err, foundlist) {
        if (!err) {
            if (!foundlist) {
                const list = new List({
                    name: customListName,
                    item: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            } else {
                res.render("list", {
                    listTitle: foundlist.name,
                    newitemlists: foundlist.item
                })
            }
        }
    })
});

app.get("/about", function (req, res) {
    res.render("about")
})

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function () {
    console.log("Server Has Started Successfully....");
})