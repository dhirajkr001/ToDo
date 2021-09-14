const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app  = express();
const _ = require("lodash");
// var items = ["Buy Food","Cook Food","Eat Food"];
// var workItems = [];

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://admin-dhiraj:admin321@cluster0.shdma.mongodb.net/todolistDB");
// variable to store the last visited page listTitle



// Creating Schema and mongodb collections

const itemSchema = {
  name: String
};

const Item = new mongoose.model("Item",itemSchema);

const listItemSchema = {
  name: String,
  items : [itemSchema]
};

const List = new mongoose.model("List", listItemSchema);




// run this function when the user is accessing for the first time


    const item1 = new Item({
      name: "Welcome to your todolist!!"
    });

    const item2 = new Item({
      name: "Hit the + button to add a new Item"
    });

    const item3 = new Item({
      name: "<-- Hit this to delete an item."
    });
    const defaultItems = [item1,item2,item3];



app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

// get method
app.get("/",function(req,res){
  Item.find({},function(err,result){
    if(result.length === 0){
      Item.insertMany(defaultItems,function(err){});
      res.redirect("/");
    }
    else{
        res.render("list",{listTitle : "Today" , newListItems: result});
  }

  });
});

app.post("/", function(req,res){
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item =  new Item({
    name: itemName
  });
  if(listName === "Today"){
    item.save();
    res.redirect("/");
  }
  else{
    List.findOne({name: listName}, function(err,result){
      result.items.push(item);
      result.save();
      res.redirect("/" + listName);
    });
  }


});


app.post("/delete",function(req,res){
  const itemId = req.body.checkbox;
  const listName = _.capitalize(req.body.listName);
  if(listName === "Today"){
    Item.deleteOne({_id: req.body.checkbox},function(err){
      if(!err){
        // console.log("successful delete");
      }
    });
    res.redirect("/");
  }
  else{
    List.findOneAndUpdate({name: listName},
    {$pull : {items: {_id : itemId}}},
  function(err,result){
    if(!err){
      res.redirect("/" + listName);
    }
  });
  }
});



app.get("/:category", function(req,res){
  const category = _.capitalize(req.params.category);
  List.findOne({name: category}, function(err,result){
      if(!result){
        const item = new List({
          name: category,
          items: defaultItems
        });
        item.save();
        res.render("list",{listTitle: category, newListItems: item.items});
      }
      else{
        res.render("list", {listTitle: category, newListItems: result.items});
      }
  });
});



app.listen(process.env.PORT || 3000,function(){
  console.log("server started at 3000");
})
