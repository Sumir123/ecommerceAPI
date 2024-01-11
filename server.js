const express = require("express");
const env = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

//ROUTES
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin/user");


env.config();

//MONGODB CONNECTION
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.rgaq9ai.mongodb.net/?retryWrites=true&w=majority`,
    { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
  )
  .then(() => {
    console.log("Database connected success");
  });

app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use("/api", userRouter);
app.use("/api/admin", adminRouter);


app.listen(process.env.PORT || 2000, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
