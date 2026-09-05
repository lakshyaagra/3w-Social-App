import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  TextField,
  Button,
  Divider,
  Collapse,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const PostCard = ({ post, onPostUpdated }) => {
  const { user } = useAuth();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const liked = user ? post.likes.includes(user.username) : false;

  const handleLike = async () => {
    if (!user) return;
    // Optimistic update so the UI feels instant.
    const optimisticLikes = liked
      ? post.likes.filter((u) => u !== user.username)
      : [...post.likes, user.username];
    onPostUpdated({ ...post, likes: optimisticLikes });

    try {
      const { data } = await api.post(`/posts/${post._id}/like`);
      onPostUpdated(data);
    } catch (err) {
      onPostUpdated(post); // revert on failure
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/posts/${post._id}/comment`, { text: commentText.trim() });
      onPostUpdated(data);
      setCommentText('');
    } catch (err) {
      // no-op; the input keeps its text so the user can retry
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card variant="outlined" sx={{ borderColor: 'divider' }}>
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: 15 }}>
            {post.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              {post.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {timeAgo(post.createdAt)}
            </Typography>
          </Box>
        </Box>

        {post.text && (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: post.imageUrl ? 1.5 : 0.5 }}>
            {post.text}
          </Typography>
        )}
      </CardContent>

      {post.imageUrl && (
        <CardMedia
          component="img"
          image={post.imageUrl}
          alt="post"
          sx={{ maxHeight: 480, objectFit: 'cover' }}
        />
      )}

      <CardContent sx={{ pt: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" onClick={handleLike} disabled={!user} color="secondary">
            {liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
          <Tooltip title={post.likes.length ? post.likes.join(', ') : 'No likes yet'}>
            <Typography variant="body2" color="text.secondary" sx={{ cursor: 'default' }}>
              {post.likes.length}
            </Typography>
          </Tooltip>

          <IconButton size="small" onClick={() => setCommentsOpen((v) => !v)} sx={{ ml: 1.5 }}>
            <ChatBubbleOutlineIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {post.comments.length}
          </Typography>
        </Box>

        <Collapse in={commentsOpen} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 1.5 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: user ? 1.5 : 0 }}>
            {post.comments.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No comments yet — be the first to say something.
              </Typography>
            )}
            {post.comments.map((c, i) => (
              <Box key={c._id || i}>
                <Typography variant="body2">
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    {c.username}
                  </Box>{' '}
                  {c.text}
                </Typography>
              </Box>
            ))}
          </Box>

          {user && (
            <Box component="form" onSubmit={handleAddComment} sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Write a comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button type="submit" variant="contained" size="small" disabled={submitting || !commentText.trim()}>
                Post
              </Button>
            </Box>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default PostCard;
