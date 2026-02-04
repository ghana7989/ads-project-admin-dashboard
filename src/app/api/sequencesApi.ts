import { baseApi } from './baseApi';
import type {
  Sequence,
  CreateSequenceRequest,
  UpdateSequenceRequest,
  AssignSequenceRequest,
  PaginatedResponse,
} from '../../types';

export const sequencesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSequences: builder.query<
      PaginatedResponse<Sequence>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `/admin/sequences?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: 'Sequence' as const,
                id,
              })),
              { type: 'Sequence', id: 'LIST' },
            ]
          : [{ type: 'Sequence', id: 'LIST' }],
    }),
    getSequence: builder.query<Sequence, string>({
      query: (id) => `/admin/sequences/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Sequence', id }],
    }),
    createSequence: builder.mutation<Sequence, CreateSequenceRequest>({
      query: (body) => ({
        url: '/admin/sequences',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Sequence', id: 'LIST' }],
    }),
    updateSequence: builder.mutation<
      Sequence,
      { id: string; data: UpdateSequenceRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/sequences/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Sequence', id },
        { type: 'Sequence', id: 'LIST' },
      ],
    }),
    deleteSequence: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/sequences/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Sequence', id: 'LIST' }],
    }),
    assignSequence: builder.mutation<
      Sequence,
      { id: string; data: AssignSequenceRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/sequences/${id}/assign`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Sequence', id },
        { type: 'Client', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetSequencesQuery,
  useGetSequenceQuery,
  useCreateSequenceMutation,
  useUpdateSequenceMutation,
  useDeleteSequenceMutation,
  useAssignSequenceMutation,
} = sequencesApi;
