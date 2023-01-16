require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./services/db");
const fightersRoutes = require("./routes/fighters");
const fightsRoutes = require("./routes/fights");
const eventsRoutes = require("./routes/events");

app.use(express.json());
app.use("/fighters", fightersRoutes);
app.use("/fights", fightsRoutes);
app.use("/events", eventsRoutes);
app.listen(3000, () => console.log("Server Started"));

module.exports = app;
