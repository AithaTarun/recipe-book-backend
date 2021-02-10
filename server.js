const express = require('express');

const app = express();

const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

mongoose.connect
(
  process.env.MONGO_DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true
  }
).then
(
  ()=>
  {
    console.log("Connected to database")
  }
).catch
(
  (e)=>
  {
    console.log(e, "Connection to database failed");
  }
);

app.use
(
  express.json()
);

app.use //To handle CORS error.
  (
    (request,response,next)=>
    {
      response.setHeader
      ('Access-Control-Allow-Origin','*');

      response.setHeader
      (
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      );

      response.setHeader
      (
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS, PUT'
      );

      next();
    }
  );

const userRoutes = require('./routes/user');
app.use("/api/user",userRoutes);

const recipeRoutes = require('./routes/recipe');
app.use("/api/recipe",recipeRoutes);

app.listen
(
  port,
  ()=>
  {
    console.log("Server is running on port",port);
  }
);

module.exports = app;

