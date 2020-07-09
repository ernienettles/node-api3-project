const express = require('express');

const server = express();

const userDb = require('../users/userDb.js');

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get('host')}`);
  next();
}

async function validateUserId(req, res, next) {
  try {
    const { id } = req.params;
    const user = await userDb.getById(id)
    if (user) {
      user = req.user;
      next();
    } else {
      res.status(400).json({ message: "invalid user id" })
    }
  } catch (error) {
    res.status(500).json({ error: "There was an error while retrieving the user id" })
  }
}

async function validateUser(req, res, next) {
  try {
    const body = req.body;
    if(body.text && body) {
      next()
    } else if (!body) {
      res.status(400).json({ message: "missing user data" })
    } else if (!body.name) {
      res.status(400).json({ message: "missing required name field" })
    }
  } catch (error) {
    res.status(500).json({ error: "There was an error while retrieving the user id" })
  }
}



module.exports = server;
