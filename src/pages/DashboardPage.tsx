import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material';
import TvIcon from '@mui/icons-material/Tv';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import { useGetClientsQuery } from '../app/api/clientsApi';
import { useGetVideosQuery } from '../app/api/videosApi';
import { useGetSequencesQuery } from '../app/api/sequencesApi';
import { useGetLayoutsQuery } from '../app/api/layoutsApi';

interface StatCardProps {
  title: string;
  value: number | undefined;
  icon: React.ReactNode;
  color: string;
  isLoading: boolean;
}

function StatCard({ title, value, icon, color, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: 2,
              p: 1,
              display: 'flex',
              mr: 2,
            }}
          >
            <Box sx={{ color }}>{icon}</Box>
          </Box>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        {isLoading ? (
          <CircularProgress size={24} />
        ) : (
          <Typography variant="h3">{value ?? 0}</Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: clients, isLoading: clientsLoading } = useGetClientsQuery({ limit: 1 });
  const { data: videos, isLoading: videosLoading } = useGetVideosQuery({ limit: 1 });
  const { data: sequences, isLoading: sequencesLoading } = useGetSequencesQuery({ limit: 1 });
  const { data: layouts, isLoading: layoutsLoading } = useGetLayoutsQuery({ limit: 1 });

  const onlineClients = clients?.data.filter((c) => c.isOnline).length ?? 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Clients"
            value={clients?.meta.total}
            icon={<TvIcon />}
            color="#1976d2"
            isLoading={clientsLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Videos"
            value={videos?.meta.total}
            icon={<VideoLibraryIcon />}
            color="#9c27b0"
            isLoading={videosLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sequences"
            value={sequences?.meta.total}
            icon={<AccountTreeIcon />}
            color="#2e7d32"
            isLoading={sequencesLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Layouts"
            value={layouts?.meta.total}
            icon={<ViewQuiltIcon />}
            color="#ed6c02"
            isLoading={layoutsLoading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Client Status
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box>
                  <Typography variant="h3" color="success.main">
                    {onlineClients}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Online
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h3" color="text.secondary">
                    {(clients?.meta.total ?? 0) - onlineClients}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Offline
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use the sidebar to manage clients, videos, sequences, and layouts.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
