const express = require('express');

const router = express.Router();

const userDb = require('./userDb.js');
const postDb = require('../posts/postDb')

router.post('/', validateUser, async (req, res) => {
  // do your magic!
  try {
    const user = await userDb.insert(user);

    res.status(200).json(user);
  } catch(error) {
    res.status(500).json({ message: "Error creating new user" })
  }

});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  // do your magic!
  try {
    const post = await postDb.insert({ text: req.body.text, user_id: req.user.id})

    res.status(201).json(post)
  } catch(error) {
    res.status(500).json({ message: "Error creating new post" })
  }
});

router.get('/', async (req, res) => {
  // do your magic!
  try {
    const users = await userDb.get()

    if(users.length) {
      res.status(200).json(users)
    }
  } catch(error) {
    res.status(500).json({ message: "Error when requesting user info." })
  }
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, async (req, res) => {
  // do your magic!
  try {
    const { id } = req.params;
    const posts = await userDb.getUserPosts(id)

    if(posts.length) {
      res.status(200).json(posts)
    } else {
      res.status(404).json({ message: "No posts found for the requested user."})
    }
  } catch {
    res.status(500).json({ message: "Error when requesting user post data." })
  }
});

router.delete('/:id', validateUserId, async (req, res) => {
  // do your magic!
  try {
    const deletedUser = await userDb.remove(req.user.id);
    res.status(200).json(deletedUser)
  } catch {
    res.status(500).json({ message: "Error when requesting deletion." })
  }
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
  // do your magic!
  try {
    const { id } = req.params;
    const user = req.body;

    const newUser = await userDb.update(id, user);

    res.status(200).json(newUser)
  } catch(error) {
    res.status(500).json({ message: "Error when attempting to edit data." })
  }
});

//custom middleware

async function validateUserId(req, res, next) {
  try {
    const user = await db.getById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "invalid user id" });
    }
    req.user = user;
    next();
  } catch(err) {
    res.status(500).json({message: "error retrieving user from database"});
  }
}

function validateUser(req, res, next) {
  if(!Object.keys(req.body).length) {
    return res.status(400).json({ message: "missing user data" });
  }
  if(!req.body.name) {
    return res.status(400).json({ message: "missing required name field" });
  }
  next();
}

function validatePost(req, res, next) {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ message: "missing post data" });
  }
  if (!req.body.text) {
    return res.status(400).json({ message: "missing required text field" });
  }
  next();
}

module.exports = router;
