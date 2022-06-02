//Require Dependencies
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");

//Import Model
const Car = require("./models/car");

//Database Connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Database Connection Error/Success
const MONGODB_URI = process.env.MONGODB_URI;
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

//MIDDLEWARE & BODY PARSER
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//ROUTES

const seedCar = require('./models/cars.js');
app.get('/seed', (req, res) => {
  Car.deleteMany({}, (error, allCars) => {});
  Car.create(seedCar, (error, data) => {
    res.redirect('/cars');
  });
});

app.get('/home', (req,res) => {
    res.render("home.ejs")

});

app.get("/cars", (req,res)=>{
    Car.find({}, (err, allCars)=>{
        res.render("index.ejs", {
            cars: allCars,
        });
    });
});

app.get("/cars/new", (req, res) => {
	res.render("new.ejs");
});

app.delete("/cars/:id", (req,res)=>{
  Car.findByIdAndRemove(req.params.id, (err,deletedCar)=>{
      res.redirect("/cars");
  });

});

app.get('/cars/:id', (req, res) => {
  Car.findById(req.params.id, (err, data) => {
    res.render("show.ejs", {
      Car:data
    })
  })

});

app.put("/cars/:id", (req, res) => {
    if (req.body.completed === "on") {
      req.body.completed = true;
    } else {
      req.body.completed = false;
    }
    Car.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        },
        (error, updatedCar) => {
          res.redirect(`/cars/${req.params.id}`)
        });
  });

  app.post("/cars", (req,res)=>{
    Car.create(req.body, (err,createdCar)=>{
        if (err) console.log (err);
        res.redirect("/cars");
    });
});

app.get("/cars/:id/edit", (req, res) => {
  Car.findById(req.params.id, (error, foundCar) => {
    res.render("edit.ejs", {
      car: foundCar,
    });
  });
});

app.listen(process.env.PORT, () =>
    console.log("connected")
);