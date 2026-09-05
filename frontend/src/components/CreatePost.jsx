import React, { useState, useRef, forwardRef } from 'react';
import { Card, CardContent, TextField, Box, Button, IconButton, Typography, Alert, Divider } from '@mui/material';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import api from '../api/axios';

const CreatePost = forwardRef(({ onPostCreated }, ref) => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!text.trim() && !imageFile) {
      setError('Add some text or an image before posting.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('text', text.trim());
      if (imageFile) formData.append('image', imageFile);

      const { data } = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onPostCreated(data);
      setText('');
      clearImage();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create the post. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card ref={ref} variant="outlined" sx={{ borderColor: 'divider' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Create Post
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiOutlinedInput-root': { px: 0 },
            }}
          />

          {preview && (
            <Box sx={{ position: 'relative', mt: 1, mb: 1.5, display: 'inline-block' }}>
              <Box
                component="img"
                src={preview}
                alt="preview"
                sx={{ maxHeight: 220, borderRadius: 2, display: 'block' }}
              />
              <IconButton
                size="small"
                onClick={clearImage}
                sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.55)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 1.5 }}>
              {error}
            </Alert>
          )}

          <Divider sx={{ mb: 1.5 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              component="label"
              size="small"
              startIcon={<CameraAltOutlinedIcon />}
              color="primary"
            >
              Photo
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>

            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon sx={{ fontSize: 16 }} />}
              disabled={submitting}
              sx={{
                bgcolor: 'text.primary',
                color: 'background.default',
                '&:hover': { bgcolor: 'text.secondary' },
              }}
            >
              {submitting ? 'Posting...' : 'Post'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

export default CreatePost;
