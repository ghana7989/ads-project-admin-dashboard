import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  IconButton,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import PictureInPictureIcon from '@mui/icons-material/PictureInPicture';
import {
  useGetLayoutsQuery,
  useCreateLayoutMutation,
  useDeleteLayoutMutation,
} from '../app/api/layoutsApi';
import { LayoutType, type CreateLayoutRequest } from '../types';

const layoutTypeIcons: Record<LayoutType, React.ReactNode> = {
  [LayoutType.FULLSCREEN]: <FullscreenIcon sx={{ fontSize: 48 }} />,
  [LayoutType.SPLIT_HORIZONTAL]: <ViewStreamIcon sx={{ fontSize: 48 }} />,
  [LayoutType.SPLIT_VERTICAL]: <ViewColumnIcon sx={{ fontSize: 48 }} />,
  [LayoutType.PIP]: <PictureInPictureIcon sx={{ fontSize: 48 }} />,
};

export default function LayoutsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateLayoutRequest>({
    name: '',
    type: LayoutType.FULLSCREEN,
    config: JSON.stringify({ backgroundColor: '#000000' }),
  });

  const { data, isLoading } = useGetLayoutsQuery({ limit: 50 });
  const [createLayout, { isLoading: isCreating }] = useCreateLayoutMutation();
  const [deleteLayout] = useDeleteLayoutMutation();

  const handleOpenDialog = () => {
    setFormData({
      name: '',
      type: LayoutType.FULLSCREEN,
      config: JSON.stringify({ backgroundColor: '#000000' }),
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmit = async () => {
    try {
      await createLayout(formData).unwrap();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to create layout:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this layout?')) {
      try {
        await deleteLayout(id).unwrap();
      } catch (error) {
        console.error('Failed to delete layout:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Layouts</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
          Add Layout
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {data?.data.map((layout) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={layout.id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 100,
                      backgroundColor: 'grey.100',
                      borderRadius: 1,
                      mb: 2,
                    }}
                  >
                    {layoutTypeIcons[layout.type]}
                  </Box>
                  <Typography variant="h6" noWrap>
                    {layout.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {layout.type.replace('_', ' ')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {layout._count?.clients || 0} clients
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <IconButton size="small" title="Edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(layout.id)}
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
                  <Typography color="text.secondary">No layouts found</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {/* Create Layout Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Layout</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <TextField
            label="Type"
            select
            fullWidth
            margin="normal"
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as LayoutType })
            }
          >
            <MenuItem value={LayoutType.FULLSCREEN}>Fullscreen</MenuItem>
            <MenuItem value={LayoutType.SPLIT_HORIZONTAL}>Split Horizontal</MenuItem>
            <MenuItem value={LayoutType.SPLIT_VERTICAL}>Split Vertical</MenuItem>
            <MenuItem value={LayoutType.PIP}>Picture in Picture</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isCreating || !formData.name}
          >
            {isCreating ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
