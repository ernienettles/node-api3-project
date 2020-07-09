const express = require("express"); // importing a CommonJS module
const morgan = require("morgan"); // third party, needs npm instal morgan

const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

// global middlware - applies to every request
server.use(express.json()); // built-in middleware, no need to npm install
// server.use(gatekeeper);
server.use(morgan("combined"));

server.use("/api/hubs", hubsRouter);

server.get("/", (req, res) => {
    const nameInsert = req.name ? ` ${req.name}` : "";

    res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.post("/cars", addDoors, addMirrors, (req, res) => {
    res.status(200).json(req.car);
});

function addMirrors(req, res, next) {
    req.car.doors.mirrors = "cool mirrors";

    next();
}

function addDoors(req, res, next) {
    let car = req.body;

    car.doors = {};

    req.car = car;

    next();
}

// the three amigas
function gatekeeper(req, res, next) {
    const seconds = new Date().getSeconds();

    if (seconds % 3 === 0) {
        res.status(401).json({ you: "shall no pass" });
    } else {
        next();
    }
}

// function morgan(format, options) {
//     // other code

//     return function (req, res, next) {
//         // middleware
//     };
// }

module.exports = server;
