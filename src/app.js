if (process.env.USER) require("dotenv").config();
const express = require("express");
const cors = require("cors")
const app = express();
const moviesRouter = require("./movies/movies.router");
const theatersRouter = require("./theaters/theaters.router");

app.use(express.json());
app.use(cors())

app.use("/ping", (_request, response, _next) => {
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  response.json({ data: "pong!" });
});

app.use("/movies", moviesRouter)
app.use("/theaters", theatersRouter)

// Not found handler
app.use((req, res, next) => {
  next({ status: 404, message: `Not found: ${req.originalUrl}` });
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;
  res.status(status).json({ error: message });
});

module.exports = app;
