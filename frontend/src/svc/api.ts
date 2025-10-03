import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:4000";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  title?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  groups?: { id: number; name: string }[];
}
export interface Group {
  id: number;
  name: string;
  description?: string | null;
  createdAt: string;
  membersCount: number;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Users", "User", "Groups"],
  endpoints: b => ({
    getUsers: b.query<
      { items: User[]; total: number; page: number; perPage: number },
      {
        page?: number;
        perPage?: number;
        q?: string;
        sort?: string;
        groupId?: number;
        ungroupedOnly?: boolean;
      }
    >({
      query: (p = {}) => {
        const params = new URLSearchParams();
        if (p.page) params.set("page", String(p.page));
        if (p.perPage) params.set("perPage", String(p.perPage));
        if (p.q) params.set("q", p.q);
        if (p.sort) params.set("sort", p.sort);
        if (p.groupId) params.set("groupId", String(p.groupId));
        if (p.ungroupedOnly) params.set("ungroupedOnly", "true");
        return { url: "/api/users?" + params.toString() };
      },
      providesTags: res =>
        res?.items
          ? [
              { type: "Users", id: "LIST" },
              ...res.items.map(u => ({ type: "User" as const, id: u.id })),
            ]
          : [{ type: "Users", id: "LIST" }],
    }),
    getUser: b.query<User, number>({
      query: id => `/api/users/${id}`,
      providesTags: (_res, _e, id) => [{ type: "User", id }],
    }),
    createUser: b.mutation<User, Partial<User>>({
      query: body => ({ url: "/api/users", method: "POST", body }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    updateUser: b.mutation<User, { id: number; patch: Partial<User> }>({
      query: ({ id, patch }) => ({
        url: `/api/users/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_res, _e, arg) => [
        { type: "User", id: arg.id },
        { type: "Users", id: "LIST" },
      ],
    }),
    deleteUser: b.mutation<{ ok?: boolean }, number>({
      query: id => ({ url: `/api/users/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    getGroups: b.query<Group[], void>({
      query: () => "/api/groups",
      providesTags: [{ type: "Groups", id: "LIST" }],
    }),
    addToGroup: b.mutation<{ ok: boolean }, { id: number; groupId: number }>({
      query: ({ id, groupId }) => ({
        url: `/api/users/${id}/groups/${groupId}`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, a) => [
        { type: "User", id: a.id },
        { type: "Groups", id: "LIST" },
      ],
    }),
    removeFromGroup: b.mutation<
      { ok: boolean },
      { id: number; groupId: number }
    >({
      query: ({ id, groupId }) => ({
        url: `/api/users/${id}/groups/${groupId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, a) => [
        { type: "User", id: a.id },
        { type: "Groups", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetGroupsQuery,
  useAddToGroupMutation,
  useRemoveFromGroupMutation,
} = api;
