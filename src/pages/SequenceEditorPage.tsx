import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Chip,
  FormControlLabel,
  Switch,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  useGetSequenceQuery,
  useUpdateSequenceMutation,
  useCreateSequenceMutation,
} from '../app/api/sequencesApi';
import { useGetVideosQuery } from '../app/api/videosApi';
import type { Video } from '../types';

const MAIN_SIDEBAR_WIDTH = 240;
const HEADER_HEIGHT = 64;

interface SortableVideoItemProps {
  video: Video;
  onRemove: () => void;
}

function SortableVideoItem({ video, onRemove }: SortableVideoItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: video.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} sx={{ mb: 1, display: 'flex' }}>
      <Box
        {...attributes}
        {...listeners}
        sx={{
          display: 'flex',
          alignItems: 'center',
          pl: 1,
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
        }}
      >
        <DragIndicatorIcon color="action" />
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 120, height: 68, objectFit: 'cover' }}
        image={video.thumbnail || 'https://via.placeholder.com/120x68?text=No+Thumbnail'}
        alt={video.title}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardContent sx={{ flex: '1 0 auto', py: 1, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {video.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : 'Unknown duration'}
          </Typography>
        </CardContent>
      </Box>
      <CardActions>
        <IconButton size="small" color="error" onClick={onRemove}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default function SequenceEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const { data: sequence, isLoading } = useGetSequenceQuery(id!, { skip: isNew });
  const [updateSequence, { isLoading: isUpdating }] = useUpdateSequenceMutation();
  const [createSequence, { isLoading: isCreating }] = useCreateSequenceMutation();
  const { data: videosData } = useGetVideosQuery({ limit: 100 });

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedVideos, setSelectedVideos] = useState<Video[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (sequence) {
      setName(sequence.name || '');
      setDescription(sequence.description || '');
      setIsActive(sequence.isActive);
      setStartDate(sequence.startDate || '');
      setEndDate(sequence.endDate || '');

      // Parse videoIds and populate with video objects
      if (sequence.videoIds && sequence.videos) {
        setSelectedVideos(sequence.videos);
      }
    }
  }, [sequence]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSelectedVideos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addVideo = (video: Video) => {
    if (!selectedVideos.find((v) => v.id === video.id)) {
      setSelectedVideos([...selectedVideos, video]);
    }
  };

  const removeVideo = (videoId: string) => {
    setSelectedVideos(selectedVideos.filter((v) => v.id !== videoId));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a sequence name');
      return;
    }

    if (selectedVideos.length === 0) {
      alert('Please add at least one video to the sequence');
      return;
    }

    const videoIds = JSON.stringify(selectedVideos.map((v) => v.id));

    const data = {
      name,
      description: description || undefined,
      videoIds,
      isActive,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    try {
      if (isNew) {
        const result = await createSequence(data).unwrap();
        alert('Sequence created successfully');
        navigate(`/sequences/${result.id}/edit`);
      } else {
        await updateSequence({ id: id!, data }).unwrap();
        alert('Sequence saved successfully');
      }
    } catch (error) {
      console.error('Failed to save sequence:', error);
      alert('Failed to save sequence');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const availableVideos = videosData?.data || [];
  const isSaving = isUpdating || isCreating;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: HEADER_HEIGHT,
        left: MAIN_SIDEBAR_WIDTH,
        width: `calc(100vw - ${MAIN_SIDEBAR_WIDTH}px)`,
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Toolbar */}
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/sequences')}>
            Back
          </Button>
          <Typography variant="h6">{isNew ? 'New Sequence' : 'Edit Sequence'}</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Grid container spacing={0} sx={{ height: '100%' }}>
          {/* Left Panel: Available Videos */}
          <Grid size={4} sx={{ height: '100%', borderRight: 1, borderColor: 'divider' }}>
            <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                Available Videos
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Click to add videos to the sequence
              </Typography>
              {availableVideos.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  No videos available. Add videos first.
                </Typography>
              ) : (
                <Box sx={{ mt: 2 }}>
                  {availableVideos.map((video) => (
                    <Card key={video.id} sx={{ mb: 2 }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={video.thumbnail || 'https://via.placeholder.com/320x180?text=No+Thumbnail'}
                        alt={video.title}
                      />
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom noWrap>
                          {video.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <Chip
                            label={video.source}
                            size="small"
                            variant="outlined"
                          />
                          {video.duration && (
                            <Chip
                              label={`${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => addVideo(video)}
                          disabled={selectedVideos.some((v) => v.id === video.id)}
                        >
                          {selectedVideos.some((v) => v.id === video.id) ? 'Added' : 'Add'}
                        </Button>
                      </CardActions>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>

          {/* Right Panel: Sequence Builder */}
          <Grid size={8} sx={{ height: '100%' }}>
            <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
              {/* Sequence Details */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Sequence Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Sequence Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="End Date"
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isActive}
                          onChange={(e) => setIsActive(e.target.checked)}
                        />
                      }
                      label="Active"
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Video Sequence */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Video Sequence ({selectedVideos.length} videos)
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Drag to reorder. Videos will play in order and loop continuously.
                </Typography>

                {selectedVideos.length === 0 ? (
                  <Box
                    sx={{
                      py: 6,
                      textAlign: 'center',
                      border: '2px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                      mt: 2,
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      No videos added yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add videos from the left panel
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ mt: 2 }}>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={selectedVideos.map((v) => v.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {selectedVideos.map((video) => (
                          <SortableVideoItem
                            key={video.id}
                            video={video}
                            onRemove={() => removeVideo(video.id)}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  </Box>
                )}
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
