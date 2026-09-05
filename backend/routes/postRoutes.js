const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createPost,
  getFeed,
  toggleLike,
  addComment,
} = require('../controllers/postController');

router.get('/', getFeed); // public — anyone can view the feed
router.post('/', protect, upload.single('image'), createPost);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);

module.exports = router;
