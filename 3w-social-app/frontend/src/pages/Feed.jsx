import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Chip,
  Fab,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

const FILTERS = [
  { key: 'newest', label: 'All Post' },
  { key: 'mostLiked', label: 'Most Liked' },
  { key: 'mostCommented', label: 'Most Commented' },
];

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const composerRef = useRef(null);

  const loadFeed = useCallback(async (pageToLoad, sortToUse) => {
    const { data } = await api.get('/posts', { params: { page: pageToLoad, limit: 10, sort: sortToUse } });
    setPosts((prev) => (pageToLoad === 1 ? data.posts : [...prev, ...data.posts]));
    setHasMore(data.hasMore);
    setPage(data.page);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    loadFeed(1, sort)
      .catch(() => setError('Could not load the feed. Try refreshing.'))
      .finally(() => setLoading(false));
  }, [loadFeed, sort]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      await loadFeed(page + 1, sort);
    } catch {
      setError('Could not load more posts.');
    } finally {
      setLoadingMore(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handleComposeClick = () => {
    composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Search is a live client-side filter over the currently loaded page(s) —
  // not a separate backend endpoint, since the assignment doesn't call for one.
  const visiblePosts = useMemo(() => {
    if (!search.trim()) return posts;
    const q = search.trim().toLowerCase();
    return posts.filter(
      (p) => p.username.toLowerCase().includes(q) || (p.text || '').toLowerCase().includes(q)
    );
  }, [posts, search]);

  return (
    <Container maxWidth="sm" sx={{ py: 3, pb: 10 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search users, posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />

        {user ? (
          <CreatePost ref={composerRef} onPostCreated={handlePostCreated} />
        ) : (
          <Alert severity="info">Log in to post, like, or comment. Anyone can browse the feed.</Alert>
        )}

        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5 }}>
          {FILTERS.map((f) => (
            <Chip
              key={f.key}
              label={f.label}
              clickable
              onClick={() => setSort(f.key)}
              variant={sort === f.key ? 'filled' : 'outlined'}
              color={sort === f.key ? 'primary' : 'default'}
              sx={{
                borderColor: 'divider',
                color: sort === f.key ? 'primary.contrastText' : 'text.secondary',
                flexShrink: 0,
              }}
            />
          ))}
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : visiblePosts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Inventory2OutlinedIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 1.5, opacity: 0.6 }} />
            <Typography variant="body1" color="text.secondary">
              {search.trim() ? 'No posts match your search.' : 'Nothing here yet, check back soon!'}
            </Typography>
          </Box>
        ) : (
          visiblePosts.map((post) => (
            <PostCard key={post._id} post={post} onPostUpdated={handlePostUpdated} />
          ))
        )}

        {hasMore && !loading && !search.trim() && (
          <Box sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
            <Button onClick={handleLoadMore} disabled={loadingMore} variant="outlined">
              {loadingMore ? 'Loading...' : 'Load more'}
            </Button>
          </Box>
        )}
      </Box>

      {user && (
        <Fab
          color="primary"
          onClick={handleComposeClick}
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          aria-label="Create post"
        >
          <AddIcon />
        </Fab>
      )}
    </Container>
  );
};

export default Feed;
