import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrls, client_id, client_secret, environment } from "config";

const apiEndpoint = (baseUrls.api.trim().endsWith("/") ? baseUrls.api.trim() : (baseUrls.api.trim() + "/"));

export const backendApi = createApi({
    reducerPath: 'api-v2',
    baseQuery: fetchBaseQuery({ baseUrl: apiEndpoint }),
    endpoints: builder => ({
        get: builder.query({
            query: (arg) => {
                const { context, id = "", params } = arg;
                return `/${context}` + String.isEmpty(id) ? `/${id}` : ``;
            },
        }),
        transformResponse: (response) => {

            return response.data
        },
    }),
});

// RTK Query will automatically generate hooks for each endpoint query
export const { useGetQuery } = backendApi;
