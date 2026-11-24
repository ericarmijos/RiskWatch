const express = require("express");
require("./config/dbConnect");

const app  = express();
const cors = require ("cors");

app.use(cors({
    origin: "https://ericarmijos.github.io/RiskWatch/search.html"
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/watchlist", require("./routes/watchlistRoutes.js"));

const secRoutes = require("./routes/secRoutes");
app.use("/api/sec", secRoutes);

const companyRoutes = require("./routes/companyRoutes");
app.use("/api/companies", companyRoutes);

app.listen(3000, ()=>console.log("Server running at port 3000"));
