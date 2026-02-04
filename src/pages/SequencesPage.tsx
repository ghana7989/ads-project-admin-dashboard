import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  useGetSequencesQuery,
  useCreateSequenceMutation,
  useDeleteSequenceMutation,
} from '../app/api/sequencesApi';
import type { CreateSequenceRequest } from '../types';

export default function SequencesPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateSequenceRequest>({
    name: '',
    description: '',
    videoIds: JSON.stringify([]),
  });

  const { data, isLoading } = useGetSequencesQuery({
    page: page + 1,
    limit: rowsPerPage,
  });
  const [createSequence, { isLoading: isCreating }] = useCreateSequenceMutation();
  const [deleteSequence] = useDeleteSequenceMutation();

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = () => {
    setFormData({
      name: '',
      description: '',
      videoIds: JSON.stringify([]),
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const result = await createSequence(formData).unwrap();
      handleCloseDialog();
      navigate(`/sequences/${result.id}/edit`);
    } catch (error) {
      console.error('Failed to create sequence:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this sequence?')) {
      try {
        await deleteSequence(id).unwrap();
      } catch (error) {
        console.error('Failed to delete sequence:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Sequences</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
          New Sequence
        </Button>
      </Box>

      <Card>
        <CardContent>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Assigned Clients</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.data.map((sequence) => (
                      <TableRow key={sequence.id}>
                        <TableCell>{sequence.name}</TableCell>
                        <TableCell>{sequence.description || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={sequence.isActive ? 'Active' : 'Inactive'}
                            color={sequence.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{sequence._count?.clients || 0}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/sequences/${sequence.id}/edit`)}
                            title="Edit"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(sequence.id)}
                            title="Delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {data?.data.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No sequences found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={data?.meta.total || 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Sequence Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Sequence</DialogTitle>
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
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isCreating || !formData.name}
          >
            {isCreating ? <CircularProgress size={24} /> : 'Create & Edit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
