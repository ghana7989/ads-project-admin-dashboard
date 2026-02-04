import { baseApi } from './baseApi';
import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
  PaginatedResponse,
} from '../../types';

export const clientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<
      PaginatedResponse<Client>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `/admin/clients?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Client' as const, id })),
              { type: 'Client', id: 'LIST' },
            ]
          : [{ type: 'Client', id: 'LIST' }],
    }),
    getClient: builder.query<Client, string>({
      query: (id) => `/admin/clients/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Client', id }],
    }),
    createClient: builder.mutation<Client, CreateClientRequest>({
      query: (body) => ({
        url: '/admin/clients',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),
    updateClient: builder.mutation<
      Client,
      { id: string; data: UpdateClientRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/clients/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Client', id },
        { type: 'Client', id: 'LIST' },
      ],
    }),
    deleteClient: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/clients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),
    forceRefreshClient: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/clients/${id}/refresh`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useForceRefreshClientMutation,
} = clientsApi;
