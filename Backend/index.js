require("dotenv").config();
require("./config/passport");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/auth", require("./routes/auth"));
app.use("/api/debug", require("./routes/debug"));

console.log("MONGO_URI USED:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connection successful"))
  .catch(err => console.error(err));

mongoose.connection.once("open", () => { 
  console.log("CONNECTED DB:", mongoose.connection.name);
});


app.listen(process.env.PORT || 5000,() =>{
    console.log(`On port ${process.env.PORT}`)  
});

app.use("/api", require("./routes/test"));


app.get("/", (req, res) => {
  res.send("Server running on port");
});
 

