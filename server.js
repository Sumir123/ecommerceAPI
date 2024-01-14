const express = require("express");
const env = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const morgan = require("morgan");

const app = express();

//ROUTES
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin/user");
const categoryRouter = require("./routes/category");
const productRouter = require("./routes/product");

env.config();

//MONGODB CONNECTION
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.rgaq9ai.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Database connected success");
  });

// Use the Morgan middleware
app.use(morgan("dev"));

app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use("/api", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api", categoryRouter);
app.use("/api", productRouter);

app.listen(process.env.PORT || 2000, () => {
  console.log(`server is running on  http://localhost:${process.env.PORT}`);
});
