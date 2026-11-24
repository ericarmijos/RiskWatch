const express = require("express");
require("./config/dbConnect");

const app  = express();
const cors = require ("cors");

app.use(cors({
    origin: "http://127.0.0.1:5500"
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/watchlist", require("./routes/watchlistRoutes.js"));

const secRoutes = require("./routes/secRoutes");
app.use("/api/sec", secRoutes);

const companyRoutes = require("./routes/companyRoutes");
app.use("/api/companies", companyRoutes);

app.listen(3000, ()=>console.log("Server running at port 3000"));
