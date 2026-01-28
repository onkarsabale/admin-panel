const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const adminRoutes = require("./routes/admin.routes");
const farmerRoutes = require("./routes/farmer.routes");
const buyerRoutes = require("./routes/buyer.routes");
const pricingRoutes = require("./routes/pricing.routes");

const app = express();

/* =======================
   GLOBAL MIDDLEWARE
======================= */
app.use(cors());
app.use(express.json());

/* =======================
   ROUTES
======================= */
app.use("/admin", adminRoutes);
app.use("/admin/pricing", pricingRoutes);
app.use("/farmers", farmerRoutes);
app.use("/buyers", buyerRoutes);

/* =======================
   DATABASE
======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

module.exports = app;
