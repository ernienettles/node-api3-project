const express = require('express');

const router = express.Router();

const postDb = require('./postDb.js');

router.get('/', async (req, res) => {
  // do your magic!
  try {
    const posts = await postDb.get();

    if (posts.length) {
      res.status(200).json(posts)
    }
  } catch(error) {

  }
});

router.get('/:id', validatePostId, async (req, res) => {
  // do your magic!
  try {
    const { id } = req.params;
    const post = await postDb.getById(id)

    res.status(200).json(post)
  } catch {
    res.status(500).json({ error: "The post information could not be retrieved." });
  }
});

router.delete('/:id', validatePostId, async (req, res) => {
  // do your magic!
  try {
    const { id } = req.params;
    const post = await postDb.getById(id)

    await postDb.remove(id);

    res.status(200).json(post);
  } catch {
    res.status(500).json({ error: "The post could not be removed" })
  }
});

router.put('/:id', validatePostId, async (req, res) => {
  // do your magic!
  const { id } = req.params;
  const { title, contents } = req.body;
  const post = await postDb.getById(id)

  if (!title || !contents) {
    return res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  }
  
  const newPost = post.update(id, req.body);

  res.status(200).json(newPost);
});

// custom middleware

async function validatePost(req, res, next) {
  try {
    const body = req.body;
    if(body.text && body) {
      next()
    } else if (!body) {
      res.status(400).json({ message: "missing user data" })
    } else if (!body.text) {
      res.status(400).json({ message: "missing required text field" })
    }
  } catch (error) {
    res.status(500).json({ error: "There was an error while retrieving the user id" })
  }
}

function validatePostId(req, res, next) {
  // do your magic!
  try {
    const { id } = req.params;
    const post = await userDb.getById(id)
    if (post) {
      post = req.post;
      next();
    } else {
      res.status(400).json({ message: "invalid post id" })
    }
  } catch (error) {
    res.status(500).json({ error: "There was an error while retrieving the post id" })
  }
}

module.exports = router;
