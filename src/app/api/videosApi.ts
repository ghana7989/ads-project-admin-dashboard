import { baseApi } from './baseApi';
import type {
  Video,
  CreateVideoRequest,
  UpdateVideoRequest,
  PaginatedResponse,
} from '../../types';

export const videosApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVideos: builder.query<
      PaginatedResponse<Video>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `/admin/videos?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Video' as const, id })),
              { type: 'Video', id: 'LIST' },
            ]
          : [{ type: 'Video', id: 'LIST' }],
    }),
    getVideo: builder.query<Video, string>({
      query: (id) => `/admin/videos/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Video', id }],
    }),
    createVideo: builder.mutation<Video, CreateVideoRequest>({
      query: (body) => ({
        url: '/admin/videos',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Video', id: 'LIST' }],
    }),
    updateVideo: builder.mutation<
      Video,
      { id: string; data: UpdateVideoRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/videos/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Video', id },
        { type: 'Video', id: 'LIST' },
      ],
    }),
    deleteVideo: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/videos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Video', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetVideosQuery,
  useGetVideoQuery,
  useCreateVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
} = videosApi;
