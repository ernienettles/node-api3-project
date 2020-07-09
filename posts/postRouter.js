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
  res.status(200).json(req.post)
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

async function validatePostId(req, res, next) {
  const post = await db.getById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "invalid post id" });
  }
  req.post = req.params.id;
  next();
}


module.exports = router;
