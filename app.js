const express = require("express");
const bodyParse = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const _=require("lodash");


const app = express();
//database

mongoose.connect('mongodb+srv://mahanthasimha37:rammahi21@mahanthasimha.0g62iuc.mongodb.net/todolistdb')
    .then(() => console.log('Connected!'));

const itemSchema = new mongoose.Schema({
    name: String
});

//this is the model
const Item = mongoose.model('Item', itemSchema);

const item1 = new Item(
    {
        name: "mongodb"
    }
);

const item2 = new Item({
    name: "mongoooose"
});

const list = [item1, item2];
const item = [];

const ListSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});

const List = mongoose.model("List", ListSchema);

app.set("view engine", "ejs");
app.use(bodyParse.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {


    let currentdayname = date();

    //sending the data to ejs file

    Item.find({})
        .then(function (docs) {
            if (docs.length === 0) {
                Item.insertMany(list)
                    .then(function () {
                        console.log("Successfully saved defult items to DB");
                    })
                    .catch(function (err) {
                        console.log(err);
                    });

                res.redirect("/");//we need to redirect importent
            }
            else {
                res.render('list', { data: "today", newListItems: docs });
            }


        })
        .catch(function (err) {
            console.log(err);
        });

});
app.post("/", (req, res) => {


    const itemName = req.body.getlist;
    const listname = req.body.list;
    const currentday2 = date();

    const item3 = new Item({
        name: itemName

    });
    if (listname === "today") {
        item3.save();
        res.redirect("/");
    }
    else {
        List.findOne({ name: listname })
            .then(result => {
                if (!result) {
                    // The list with the specified name was not found,so I created a new one
                    const newList = new List({
                        name: listname,
                        items: [item3] // Initializeing the items array with item3
                    });
                    newList.save();
                    res.redirect("/" + listname);
                } else {
                    // The list with the specified name was found, add item3 to the items array
                    result.items.push(item3);
                    result.save();
                    res.redirect("/" + listname);
                }
            })
            .catch(err => {
                console.error("An error occurred:", err);
                res.redirect("/");
            });
    }

});

app.post("/delete", (req, res) => {
    const deleteitem = req.body.checkbox;
    const ListNamefromtheejs = req.body.ListName;

    if (ListNamefromtheejs === "today") {
        Item.findByIdAndRemove(deleteitem).then(function () {
            console.log("Data deleted"); // Success
        }).catch(function (error) {
            console.log(error); // Failure
        });

        res.redirect("/");
    } else {
        List.findOneAndUpdate(
            { name: ListNamefromtheejs }, 
            { $pull: { items: { _id: deleteitem } } }, 
            { useFindAndModify: false } 
          )
          .exec() // Execute the query
          .then(result => {
           
            if (result) {
              res.redirect("/" + ListNamefromtheejs);
            } 
          })
          .catch(error => {
            // Handle any errors that occurred during the update process
          });
          
    }
    });

app.get("/:parmname", (req, res) => {
    const parmname = _.capitalize(req.params.parmname);
    const List1 = new List({
        name: parmname,
        items: list
    })

    List.findOne({ name: parmname })
        .then(result => {
            if (!result) {
                res.redirect("/" + parmname);
                List1.save();
                console.log("failure"); // Document with the specified name was found
                
            } else {
                console.log("wegot"); // Document with the specified name was not found
                res.render("list", { data: result.name, newListItems: result.items });
            }
        })
        .catch(err => {
            console.error("An error occurred:", err); // Handle any errors that occurred during the query
        });

});


app.listen("3000", () => {
    console.log("your post has started on 3000")
})