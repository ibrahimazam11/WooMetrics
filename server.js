const express = require('express')
const winston = require('winston');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 8835;
const database = require("./app/config/database");
const apiRoutesV1 = require("./app/v1/api/api");
require('dotenv').config();


app.get('/ping', (req, res) => {
    res.send("pong")
})

database.createMongoose();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", apiRoutesV1);
app.get("/*", async (req, res) => {
    return res.send("WooMetrics Server");
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log` 
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

process.on("uncaughtException", function (err) {
    console.log(err);
    console.log("Node NOT Exiting...");
});

app.listen(PORT, () => {
    console.log("WooMetrics Server is live on Port: ", PORT)
})