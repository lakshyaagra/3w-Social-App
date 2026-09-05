const mongoose = require("mongoose");

// Comments are a subdocument array, not a separate collection —
// the assignment allows only two collections total (users, posts).
const commentSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: { type: String, required: true }, // denormalized so the feed never needs a join/populate
    text: { type: String, trim: true, default: "" },
    imageUrl: { type: String, default: null },
    likes: [{ type: String }], // usernames of people who liked the post
    comments: [commentSchema],
  },
  { timestamps: true },
);

// The feed always sorts by recency (or falls back to it as a tiebreaker for
// mostLiked/mostCommented), so an index here keeps pagination fast as the
// collection grows instead of doing a full collection scan on every page.
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);
