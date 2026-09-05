const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const Post = require('../models/Post');

// Pipes an in-memory file buffer (from multer) up to Cloudinary and
// resolves with the upload result once it's done.
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: '3w-social-posts' },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;

    // Neither field is mandatory on its own, but at least one must be present.
    if ((!text || !text.trim()) && !req.file) {
      return res.status(400).json({ message: 'Post must contain text, an image, or both' });
    }

    let imageUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const post = await Post.create({
      author: req.user.id,
      username: req.user.username,
      text: text ? text.trim() : '',
      imageUrl,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post', error: err.message });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments(),
    ]);

    res.json({
      posts,
      page,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      hasMore: page * limit < total,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load feed', error: err.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const username = req.user.username;
    const alreadyLiked = post.likes.includes(username);

    if (alreadyLiked) {
      post.likes = post.likes.filter((u) => u !== username);
    } else {
      post.likes.push(username);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update like', error: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ username: req.user.username, text: text.trim() });
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment', error: err.message });
  }
};
