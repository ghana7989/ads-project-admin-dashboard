import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  Pagination,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
  useGetVideosQuery,
  useCreateVideoMutation,
  useDeleteVideoMutation,
} from '../app/api/videosApi';
import { formatDuration } from '../utils/videoUtils';
import type { CreateVideoRequest } from '../types';

export default function VideosPage() {
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateVideoRequest>({
    url: '',
    title: '',
  });

  const { data, isLoading } = useGetVideosQuery({ page, limit: 12 });
  const [createVideo, { isLoading: isCreating }] = useCreateVideoMutation();
  const [deleteVideo] = useDeleteVideoMutation();

  const handleOpenDialog = () => {
    setFormData({ url: '', title: '' });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmit = async () => {
    try {
      await createVideo(formData).unwrap();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to create video:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteVideo(id).unwrap();
      } catch (error) {
        console.error('Failed to delete video:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Videos</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
          Add Video
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {data?.data.map((video) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={video.thumbnail || '/placeholder-video.png'}
                    alt={video.title}
                    sx={{ backgroundColor: 'grey.200' }}
                  />
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      noWrap
                      title={video.title}
                    >
                      {video.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {video.source} {video.duration && `- ${formatDuration(video.duration)}`}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => setPreviewUrl(video.url)}
                        title="Preview"
                      >
                        <PlayArrowIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(video.id)}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {data?.data.length === 0 && (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">No videos found</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>

          {data && data.meta.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={data.meta.totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
              />
            </Box>
          )}
        </>
      )}

      {/* Create Video Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Video</DialogTitle>
        <DialogContent>
          <TextField
            label="Video URL"
            fullWidth
            margin="normal"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <TextField
            label="Duration (seconds)"
            type="number"
            fullWidth
            margin="normal"
            value={formData.duration || ''}
            onChange={(e) =>
              setFormData({ ...formData, duration: parseInt(e.target.value) || undefined })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isCreating || !formData.url || !formData.title}
          >
            {isCreating ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={!!previewUrl}
        onClose={() => setPreviewUrl(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Video Preview</DialogTitle>
        <DialogContent>
          {previewUrl && (
            <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
              <iframe
                src={previewUrl.replace('watch?v=', 'embed/')}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allowFullScreen
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewUrl(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
