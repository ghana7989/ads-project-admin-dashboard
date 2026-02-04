import { z } from 'zod';
import { VideoSource } from '../types';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  location: z.string().optional(),
  loginId: z.string().min(1, 'Login ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  sequenceId: z.string().optional(),
});

export const updateClientSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  sequenceId: z.string().optional(),
});

export const createVideoSchema = z.object({
  url: z.string().url('Invalid URL'),
  title: z.string().min(1, 'Title is required'),
  duration: z.number().min(0).optional(),
  thumbnail: z.string().url().optional(),
  source: z.nativeEnum(VideoSource).optional(),
});

export const updateVideoSchema = z.object({
  url: z.string().url('Invalid URL').optional(),
  title: z.string().min(1, 'Title is required').optional(),
  duration: z.number().min(0).optional(),
  thumbnail: z.string().url().optional(),
  source: z.nativeEnum(VideoSource).optional(),
});

export const createSequenceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  flowData: z.string().min(1, 'Flow data is required'),
  isActive: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  activeHours: z.string().optional(),
});

export const updateSequenceSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  flowData: z.string().optional(),
  isActive: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  activeHours: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type CreateClientFormData = z.infer<typeof createClientSchema>;
export type UpdateClientFormData = z.infer<typeof updateClientSchema>;
export type CreateVideoFormData = z.infer<typeof createVideoSchema>;
export type UpdateVideoFormData = z.infer<typeof updateVideoSchema>;
export type CreateSequenceFormData = z.infer<typeof createSequenceSchema>;
export type UpdateSequenceFormData = z.infer<typeof updateSequenceSchema>;
