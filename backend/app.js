const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/adminRoutes");
const app = express();

const farmerRoutes = require("./routes/farmerRoutes");
app.use("/api/farmers", farmerRoutes);


app.use(cors());
app.use(express.json());

// routes
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

module.exports = app;
