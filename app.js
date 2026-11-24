const express = require("express");
require("./config/dbConnect");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get("/", (req, res) => res.send("Root Page"));

app.get("/about", (req, res)=> res.send("About Page / GET"));

app.post("/about", (req, res) => res.send("About Page / POST"));

// app.get("/contacts/:id", (req, res) => 
//     res.send(`Display a contact for ID: ${req.params.id}`)
// );

app.get("/headers", (req, res) => res.send(headers));

app.use("/contacts", require("./routes/contactRoutes.js"));

// In the back end, you put :id, but when you use Thunder Client, you put contacts/5 if you want to get an id of 5.

//table: contacts
//columns: id, name, email, phone
//primary key: id
//Required fields: id, name, email

//TEXT NOT NULL means that it is required

//INTEGER PRIMARY KEY and TEXT NOT NULL is that INTEGER PRIMARY KEY is how you navigate through data, TEXT NOT NULL you do not navigate through data. 



app.listen(3000, ()=>console.log("Server running at port 3000"));
