import { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useForceRefreshClientMutation,
} from '../app/api/clientsApi';
import { useGetSequencesQuery } from '../app/api/sequencesApi';
import { useWebSocket } from '../hooks/useWebSocket';
import type { Client, CreateClientRequest, UpdateClientRequest } from '../types';

export default function ClientsPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { on, off } = useWebSocket();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [createFormData, setCreateFormData] = useState<CreateClientRequest>({
    name: '',
    loginId: '',
    password: '',
    description: '',
    location: '',
  });
  const [editFormData, setEditFormData] = useState<UpdateClientRequest>({
    name: '',
    description: '',
    location: '',
    sequenceId: '',
  });

  const { data, isLoading, refetch } = useGetClientsQuery({
    page: page + 1,
    limit: rowsPerPage,
  });
  const { data: sequencesData } = useGetSequencesQuery({ limit: 100 });
  const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
  const [deleteClient] = useDeleteClientMutation();
  const [forceRefresh] = useForceRefreshClientMutation();

  // Listen for real-time client status updates via WebSocket
  useEffect(() => {
    const handleClientOnline = () => {
      refetch();
    };

    const handleClientOffline = () => {
      refetch();
    };

    on('admin:client-online', handleClientOnline);
    on('admin:client-offline', handleClientOffline);

    return () => {
      off('admin:client-online', handleClientOnline);
      off('admin:client-offline', handleClientOffline);
    };
  }, [on, off, refetch]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenCreateDialog = () => {
    setCreateFormData({ name: '', loginId: '', password: '', description: '', location: '' });
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleOpenEditDialog = (client: Client) => {
    setEditingClient(client);
    setEditFormData({
      name: client.name,
      description: client.description || '',
      location: client.location || '',
      sequenceId: client.sequenceId || '',
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingClient(null);
  };

  const handleCreate = async () => {
    try {
      await createClient(createFormData).unwrap();
      handleCloseCreateDialog();
    } catch (error) {
      console.error('Failed to create client:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingClient) return;
    try {
      await updateClient({
        id: editingClient.id,
        data: editFormData,
      }).unwrap();
      handleCloseEditDialog();
    } catch (error) {
      console.error('Failed to update client:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient(id).unwrap();
      } catch (error) {
        console.error('Failed to delete client:', error);
      }
    }
  };

  const handleForceRefresh = async (id: string) => {
    try {
      await forceRefresh(id).unwrap();
      alert('Refresh command sent');
    } catch (error) {
      console.error('Failed to send refresh command:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Clients</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateDialog}>
          Add Client
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
                      <TableCell>Login ID</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Sequence</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.data.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>{client.name}</TableCell>
                        <TableCell>{client.user?.loginId}</TableCell>
                        <TableCell>{client.location || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={client.isOnline ? 'Online' : 'Offline'}
                            color={client.isOnline ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{client.sequence?.name || '-'}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleForceRefresh(client.id)}
                            title="Force Refresh"
                          >
                            <RefreshIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEditDialog(client)}
                            title="Edit"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(client.id)}
                            title="Delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {data?.data.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No clients found
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

      {/* Create Client Dialog */}
      <Dialog open={createDialogOpen} onClose={handleCloseCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={createFormData.name}
            onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
            required
          />
          <TextField
            label="Login ID"
            fullWidth
            margin="normal"
            value={createFormData.loginId}
            onChange={(e) => setCreateFormData({ ...createFormData, loginId: e.target.value })}
            required
            helperText="This will be used by the client display to login"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={createFormData.password}
            onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
            required
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={createFormData.description}
            onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
          />
          <TextField
            label="Location"
            fullWidth
            margin="normal"
            value={createFormData.location}
            onChange={(e) => setCreateFormData({ ...createFormData, location: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={isCreating || !createFormData.name || !createFormData.loginId || !createFormData.password}
          >
            {isCreating ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Client: {editingClient?.name}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={editFormData.name}
            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
            required
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={editFormData.description}
            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
          />
          <TextField
            label="Location"
            fullWidth
            margin="normal"
            value={editFormData.location}
            onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Assigned Sequence</InputLabel>
            <Select
              value={editFormData.sequenceId || ''}
              label="Assigned Sequence"
              onChange={(e) => setEditFormData({ ...editFormData, sequenceId: e.target.value || undefined })}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {sequencesData?.data.map((sequence) => (
                <MenuItem key={sequence.id} value={sequence.id}>
                  {sequence.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            disabled={isUpdating || !editFormData.name}
          >
            {isUpdating ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
