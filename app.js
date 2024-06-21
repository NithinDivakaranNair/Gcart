const express = require('express');
const app = express();
const port = 2000;
const path = require("path");
const session = require("express-session")
const { v4: uuidv4 } = require("uuid");
const nocache = require("nocache");
const userrouter = require("./Router/User");
const adminrouter = require("./Router/Admin")
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(nocache());

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/public')));

app.use(session({
  secret: uuidv4(),
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 1000 // Set the cookie to expire in 1 hour
  }
}));
app.use("/", userrouter);
app.use("/", adminrouter);


app.get('*',(req,res)=>{
  res.render("User/404page")
})

// Connect to MongoDB
// mongoose.connect('mongodb://0.0.0.0/miniproj', {
mongoose.connect("mongodb+srv://ecommers:ecommers123@cluster0.herfbhz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => { console.log("server started on http://localhost:2000/mainhomepage") });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });



 