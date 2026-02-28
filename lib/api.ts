import { axiosInstance } from "@/lib/axios";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type PaginationResult = {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
};

export type Banner = {
  _id: string;
  title: string;
  product: string;
  image: string;
  createdAt: string;
};

export type Reel = {
  _id: string;
  title: string;
  about: string;
  category: string;
  reels: { public_id: string; url: string }[];
  createdAt: string;
};

export type ShopifyProduct = {
  id: string | number;
  title: string;
  body_html?: string;
  product_type?: string;
  tags?: string;
  image?: { src: string };
  variants?: { price: string; inventory_quantity?: number }[];
};

export type ShopifyCollection = {
  id: string | number;
  title: string;
  handle: string;
  image?: { src: string };
};

export type ShopifyCustomer = {
  id: string | number;
  first_name?: string;
  last_name?: string;
  email: string;
};

export async function forgotPassword(payload: { email: string }) {
  const { data } = await axiosInstance.post<ApiResponse<null>>("/auth/forgot-password", payload);
  return data;
}

export async function resetPassword(payload: {
  email: string;
  otp: string;
  password: string;
}) {
  const { data } = await axiosInstance.post<ApiResponse<null>>("/auth/reset-password", payload);
  return data;
}

export async function verifyEmail(payload: { otp: string }) {
  const { data } = await axiosInstance.post<ApiResponse<unknown>>("/auth/verify-email", payload);
  return data;
}

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}) {
  const { data } = await axiosInstance.put<ApiResponse<null>>("/auth/change-password", payload);
  return data;
}

export async function getProfile() {
  const { data } = await axiosInstance.get<ApiResponse<{
    _id: string;
    name: string;
    email: string;
    profileImage?: { url?: string };
    role: string;
  }>>("/users/profile/me");
  return data.data;
}

export async function updateProfile(payload: FormData) {
  const { data } = await axiosInstance.put<ApiResponse<unknown>>("/users/profile", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getBanners() {
  const { data } = await axiosInstance.get<ApiResponse<Banner[]>>("/banners");
  return data.data ?? [];
}

export async function createBanner(payload: FormData) {
  const { data } = await axiosInstance.post<ApiResponse<Banner>>("/banners", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateBanner(id: string, payload: FormData) {
  const { data } = await axiosInstance.put<ApiResponse<Banner>>(`/banners/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteBanner(id: string) {
  const { data } = await axiosInstance.delete<ApiResponse<null>>(`/banners/${id}`);
  return data;
}

export async function getReels(params: { page: number; limit: number; search?: string }) {
  const { data } = await axiosInstance.get<ApiResponse<{
    reels: Reel[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalReels: number;
      limit: number;
    };
  }>>("/reels", {
    params,
  });

  return {
    items: data.data?.reels ?? [],
    pagination: {
      currentPage: data.data?.pagination?.currentPage ?? params.page,
      totalPages: data.data?.pagination?.totalPages ?? 1,
      total: data.data?.pagination?.totalReels ?? 0,
      limit: data.data?.pagination?.limit ?? params.limit,
    },
  };
}

export async function createReel(payload: FormData) {
  const { data } = await axiosInstance.post<ApiResponse<Reel>>("/reels", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteReel(id: string) {
  const { data } = await axiosInstance.delete<ApiResponse<null>>(`/reels/${id}`);
  return data;
}

export async function getInventory(params: { search?: string; page: number; limit: number }) {
  const { data } = await axiosInstance.get<ApiResponse<{ products: ShopifyProduct[] }>>("/shopify/products", {
    params: {
      limit: 250,
    },
  });

  const products = data.data?.products ?? [];
  const search = params.search?.trim().toLowerCase();
  const filtered = search
    ? products.filter((p) => p.title.toLowerCase().includes(search))
    : products;

  const start = (params.page - 1) * params.limit;
  const items = filtered.slice(start, start + params.limit);

  return {
    items,
    pagination: {
      currentPage: params.page,
      totalPages: Math.max(1, Math.ceil(filtered.length / params.limit)),
      total: filtered.length,
      limit: params.limit,
    },
  };
}

export async function getCategories(params: { search?: string; page: number; limit: number }) {
  const { data } = await axiosInstance.get<ApiResponse<{ collections: ShopifyCollection[] }>>(
    "/shopify/collections",
    {
      params: { limit: 250 },
    },
  );

  const collections = data.data?.collections ?? [];
  const search = params.search?.trim().toLowerCase();
  const filtered = search
    ? collections.filter((p) => p.title.toLowerCase().includes(search))
    : collections;

  const start = (params.page - 1) * params.limit;
  const items = filtered.slice(start, start + params.limit);

  return {
    items,
    pagination: {
      currentPage: params.page,
      totalPages: Math.max(1, Math.ceil(filtered.length / params.limit)),
      total: filtered.length,
      limit: params.limit,
    },
  };
}

//  category add and edit and delete

export async function createCategory(payload: { title: string; handle: string }) {
  const { data } = await axiosInstance.post<ApiResponse<unknown>>("/shopify/collections", payload);
  return data;
}

export async function updateCategory(id: string, payload: { title: string; handle: string }) {
  const { data } = await axiosInstance.put<ApiResponse<unknown>>(`/shopify/collections/${id}`, payload);
  return data;
}

export async function deleteCategory(id: string) {
  const { data } = await axiosInstance.delete<ApiResponse<null>>(`/shopify/collections/${id}`);
  return data;
}



export async function getUsers(params: { search?: string; page: number; limit: number }) {
  const { data } = await axiosInstance.get<ApiResponse<{ customers: ShopifyCustomer[] }>>("/shopify/customers", {
    params: {
      limit: 250,
      fields: "id,first_name,last_name,email",
    },
  });

  const users = data.data?.customers ?? [];
  const search = params.search?.trim().toLowerCase();
  const filtered = search
    ? users.filter((u) => {
        const fullName = `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim();
        return (
          fullName.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search)
        );
      })
    : users;

  const start = (params.page - 1) * params.limit;
  const items = filtered.slice(start, start + params.limit);

  return {
    items,
    pagination: {
      currentPage: params.page,
      totalPages: Math.max(1, Math.ceil(filtered.length / params.limit)),
      total: filtered.length,
      limit: params.limit,
    },
  };
}

export async function createUser(payload: { name: string; email: string; password: string }) {
  const names = payload.name.trim().split(" ");
  const first_name = names[0] ?? payload.name;
  const last_name = names.slice(1).join(" ");

  const { data } = await axiosInstance.post<ApiResponse<unknown>>("/shopify/customers/register-storefront", {
    email: payload.email,
    password: payload.password,
    first_name,
    last_name,
  });

  return data;
}

//// update user

export async function updateUser(id: string, payload: { name: string; email: string }) {
  const { data } = await axiosInstance.put<ApiResponse<unknown>>(`/shopify/customers/${id}`, payload);
  return data;
}
