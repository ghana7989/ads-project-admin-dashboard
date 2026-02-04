import { baseApi } from './baseApi';
import type {
  Layout,
  CreateLayoutRequest,
  UpdateLayoutRequest,
  PaginatedResponse,
} from '../../types';

export const layoutsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLayouts: builder.query<
      PaginatedResponse<Layout>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `/admin/layouts?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Layout' as const, id })),
              { type: 'Layout', id: 'LIST' },
            ]
          : [{ type: 'Layout', id: 'LIST' }],
    }),
    getLayout: builder.query<Layout, string>({
      query: (id) => `/admin/layouts/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Layout', id }],
    }),
    createLayout: builder.mutation<Layout, CreateLayoutRequest>({
      query: (body) => ({
        url: '/admin/layouts',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Layout', id: 'LIST' }],
    }),
    updateLayout: builder.mutation<
      Layout,
      { id: string; data: UpdateLayoutRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/layouts/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Layout', id },
        { type: 'Layout', id: 'LIST' },
      ],
    }),
    deleteLayout: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/layouts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Layout', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetLayoutsQuery,
  useGetLayoutQuery,
  useCreateLayoutMutation,
  useUpdateLayoutMutation,
  useDeleteLayoutMutation,
} = layoutsApi;
