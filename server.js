const express = require('express')
const app = express();
const PORT = process.env.PORT || 8835;
const database = require("./app/config/database");
const apiRoutesV1 = require("./app/v1/api/api");
require('dotenv').config();


app.get('/ping', (req, res)=> {
    res.send("pong")
})

database.createMongoose();
app.use(express.urlencoded({extended: true})); 
app.use(express.json());  

app.use("/api/v1", apiRoutesV1);
app.get("/*", async (req, res) => {
    return res.send("Qonectr Server");
});

process.on("uncaughtException", function (err) {
    console.log(err);
    console.log("Node NOT Exiting...");
});

app.listen(PORT, () => {
    console.log("WooMetrics Server is on Port: ", PORT)
})