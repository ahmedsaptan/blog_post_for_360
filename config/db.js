const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useCreateIndex: true,
      useFindAndModify: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected!!");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
