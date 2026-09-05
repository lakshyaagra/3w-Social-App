import React, { useEffect, useState, useCallback } from 'react';
import { Box, Container, Typography, Button, CircularProgress, Alert } from '@mui/material';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const loadFeed = useCallback(async (pageToLoad) => {
    try {
      const { data } = await api.get('/posts', { params: { page: pageToLoad, limit: 10 } });
      setPosts((prev) => (pageToLoad === 1 ? data.posts : [...prev, ...data.posts]));
      setHasMore(data.hasMore);
      setPage(data.page);
    } catch (err) {
      setError('Could not load the feed. Try refreshing.');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadFeed(1).finally(() => setLoading(false));
  }, [loadFeed]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await loadFeed(page + 1);
    setLoadingMore(false);
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {user ? (
          <CreatePost onPostCreated={handlePostCreated} />
        ) : (
          <Alert severity="info">Log in to post, like, or comment. Anyone can browse the feed.</Alert>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
            No posts yet. Be the first to share something.
          </Typography>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} onPostUpdated={handlePostUpdated} />
          ))
        )}

        {hasMore && !loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
            <Button onClick={handleLoadMore} disabled={loadingMore} variant="outlined">
              {loadingMore ? 'Loading...' : 'Load more'}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Feed;
