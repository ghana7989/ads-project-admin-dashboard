// Enums
export enum Role {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}

export enum VideoSource {
  YOUTUBE = 'YOUTUBE',
  VIMEO = 'VIMEO',
  FACEBOOK = 'FACEBOOK',
  SOUNDCLOUD = 'SOUNDCLOUD',
  STREAMABLE = 'STREAMABLE',
  WISTIA = 'WISTIA',
  TWITCH = 'TWITCH',
  DAILYMOTION = 'DAILYMOTION',
  MIXCLOUD = 'MIXCLOUD',
  VIDYARD = 'VIDYARD',
  KALTURA = 'KALTURA',
  FILE = 'FILE',
}

export enum LayoutType {
  FULLSCREEN = 'FULLSCREEN',
  SPLIT_HORIZONTAL = 'SPLIT_HORIZONTAL',
  SPLIT_VERTICAL = 'SPLIT_VERTICAL',
  PIP = 'PIP',
}

// Models
export interface User {
  id: string;
  email: string | null;
  loginId: string | null;
  role: Role;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  isOnline: boolean;
  lastSeen: string | null;
  userId: string;
  layoutId: string | null;
  sequenceId: string | null;
  createdAt: string;
  updatedAt: string;
  user?: { loginId: string | null; name: string | null };
  layout?: Layout | null;
  sequence?: Sequence | null;
}

export interface Video {
  id: string;
  url: string;
  title: string;
  duration: number | null;
  thumbnail: string | null;
  source: VideoSource;
  createdAt: string;
  updatedAt: string;
}

export interface Sequence {
  id: string;
  name: string;
  description: string | null;
  videoIds: string; // JSON array: ["id1", "id2", "id3"]
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  activeHours: string | null;
  createdAt: string;
  updatedAt: string;
  clients?: { id: string; name: string }[];
  videos?: Video[]; // Populated by backend
  _count?: { clients: number };
}

export interface Layout {
  id: string;
  name: string;
  type: LayoutType;
  config: string;
  createdAt: string;
  updatedAt: string;
  _count?: { clients: number };
}

export interface ActivityLog {
  id: string;
  clientId: string;
  action: string;
  details: string | null;
  createdAt: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface LoginRequest {
  email?: string;
  loginId?: string;
  password: string;
}

// Client DTOs
export interface CreateClientRequest {
  name: string;
  description?: string;
  location?: string;
  loginId: string;
  password: string;
  layoutId?: string;
  sequenceId?: string;
}

export interface UpdateClientRequest {
  name?: string;
  description?: string;
  location?: string;
  password?: string;
  layoutId?: string;
  sequenceId?: string;
}

// Video DTOs
export interface CreateVideoRequest {
  url: string;
  title: string;
  duration?: number;
  thumbnail?: string;
  source?: VideoSource;
}

export interface UpdateVideoRequest {
  url?: string;
  title?: string;
  duration?: number;
  thumbnail?: string;
  source?: VideoSource;
}

// Sequence DTOs
export interface CreateSequenceRequest {
  name: string;
  description?: string;
  videoIds: string; // JSON array: ["id1", "id2", "id3"]
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  activeHours?: string;
}

export interface UpdateSequenceRequest {
  name?: string;
  description?: string;
  videoIds?: string; // JSON array: ["id1", "id2", "id3"]
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  activeHours?: string;
}

export interface AssignSequenceRequest {
  clientIds: string[];
}

// Layout DTOs
export interface CreateLayoutRequest {
  name: string;
  type?: LayoutType;
  config?: string;
}

export interface UpdateLayoutRequest {
  name?: string;
  type?: LayoutType;
  config?: string;
}

