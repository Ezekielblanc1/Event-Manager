require("dotenv").config();
const express = require("express");
const app = express();
const authRoutes = require("./routes/users");
const talkRoutes = require("./routes/talks")
const feedbackRoutes = require('./routes/feedback')
const reviewRoutes = require("./routes/reviews");
const connectDB = require('./config/db')
const morgan = require('morgan')
const colors = require('colors');
const errorHandler = require('./middleware/error');


//Parse incoming body
app.use(express.json());

//Handle routes
app.use("/auth", authRoutes);
app.use("/talk", talkRoutes)
app.use("/feedback", feedbackRoutes)
app.use("/review", reviewRoutes)

app.use(errorHandler)
//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Connect DB
connectDB()

const PORT = process.env.port || 5001;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue.italic
  )
);

//Handle unresolved promise
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
