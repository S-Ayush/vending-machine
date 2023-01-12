const mongoose = require("mongoose");

const DB = "mongodb://localhost:27017/verndingMachine"; //process.env.DATABASE; //"mongodb://localhost:27017/mnp";
mongoose.set('strictQuery', true);

mongoose
  .connect(DB)
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => console.log(err));