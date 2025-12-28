import apiInstance from "../api/apiInstance";

export type Category = {
    id: number;
    title: string;
    description: string;
}

export type Post = {
    id: number;
    updatedAt: string;
    title: string;
    content: string;
    thumbnailUrl: string;
    category: Category;
    authorId: number;
    authorName: string;
    readingTime: string;
}

export const getLatestPosts = async (limit = 5) => {
    try {
        const res = await apiInstance.get("/posts/public/latest", {
            params: { limit },
        });
        const posts = res.data.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category?.title ?? "Không có danh mục",
            date: new Date(item.category?.createdAt ?? item.updatedAt).toLocaleDateString("vi-VN", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }),
            image: { uri: item.thumbnailUrl },
        }));

        return posts;
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách bài viết mới:", error);
        return [];
    }
};

export const getAllCategories = async () => {
    try {
        const res = await apiInstance.get("/categories-post/all");
        return res.data.data as Category[];
    } catch (error: any) {
        console.error("Lỗi khi lấy danh mục bài viết:", error.response?.data || error.message);
        throw error;
    }
};

export type PaginatedResponse<T> = {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    numberOfElements: number;
    items: T[];
};

export const getPublicPosts = async (
    page = 1,
    size = 10
): Promise<PaginatedResponse<Post> | null> => {
    try {
        const res = await apiInstance.get("/posts/public", {
            params: { page, size },
        });
        const data = res.data.data;
        const posts: Post[] = data.items.map((item: any) => ({
            id: item.id,
            updatedAt: item.updatedAt,
            title: item.title,
            content: item.content,
            thumbnailUrl: item.thumbnailUrl,
            category: item.category,
            authorId: item.author?.id ?? 0,
            authorName: item.author?.fullName ?? "Không rõ",
            readingTime: item.readingTimeMinutes?.toString() ?? "0",
        }));

        return {
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalPages: data.totalPages,
            numberOfElements: data.numberOfElements,
            items: posts,
        };
    } catch (error: any) {
        console.error("❌ Lỗi khi lấy danh sách bài viết public:", error.response?.data || error.message);
        return null;
    }
};

export const getPostById = async (id: number): Promise<Post | null> => {
    try {
        const res = await apiInstance.get(`/posts/${id}`);
        const item = res.data.data;

        const post: Post = {
            id: item.id,
            updatedAt: item.updatedAt,
            title: item.title,
            content: item.content,
            thumbnailUrl: item.thumbnailUrl,
            category: item.category,
            authorId: item.author?.id ?? 0,
            authorName: item.author?.fullName ?? "Không rõ",
            readingTime: item.readingTimeMinutes?.toString() ?? "0",
        };

        return post;
    } catch (error: any) {
        console.error(`❌ Lỗi khi lấy bài viết ID=${id}:`, error.response?.data || error.message);
        return null;
    }
};

export const getRelatedPosts = async (id: number, limit = 5) => {
    try {
        const res = await apiInstance.get(`/posts/public/${id}/related`, {
            params: { limit },
        });

        const data = res.data.data;
        const posts = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            excerpt: item.excerpt,
            thumbnailUrl: item.thumbnailUrl,
            slug: item.slug,
            readingTime: item.readingTimeMinutes?.toString() ?? "0",
            category: item.category?.title ?? "Không có danh mục",
            authorName: item.author?.fullName ?? "Không rõ",
        }));

        return posts;
    } catch (error: any) {
        console.error(`❌ Lỗi khi lấy bài viết liên quan (ID=${id}):`, error.response?.data || error.message);
        return [];
    }
};

// =============== EMPLOYER APIs ===============

export type MyPostResponse = {
    id: number;
    createdAt: string;
    updatedAt: string;
    title: string;
    excerpt: string;
    content: string;
    contentText: string;
    thumbnailUrl: string;
    tags: string;
    slug: string;
    readingTimeMinutes: number;
    category: Category;
    status: "PENDING" | "PUBLIC" | "DRAFT";
};

export const getMyPosts = async (
    pageNumber = 1,
    pageSize = 10,
    sorts = "createdAt:desc"
): Promise<PaginatedResponse<MyPostResponse>> => {
    try {
        const res = await apiInstance.get("/posts/my", {
            params: { pageNumber, pageSize, sorts },
        });
        return res.data.data;
    } catch (error: any) {
        console.error("❌ Lỗi khi lấy danh sách bài viết của tôi:", error.response?.data || error.message);
        throw error;
    }
};

export const createPost = async (
    postData: {
        title: string;
        content: string;
        excerpt?: string;
        tags?: string;
        categoryId: number;
        status?: "PENDING";
    },
    thumbnail?: any
) => {
    try {
        const formData = new FormData();

        // Phần JSON "post"
        formData.append("post", JSON.stringify(postData));

        // Phần file "thumbnail" (nếu có)
        if (thumbnail) {
            formData.append("thumbnail", {
                uri: thumbnail.uri,
                name: thumbnail.name,
                type: thumbnail.mimeType || "image/jpeg",
            } as any);
        }

        const res = await apiInstance.post("/posts/mobile", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        return res.data;
    } catch (error: any) {
        console.error("❌ Lỗi khi tạo bài viết:", error.response?.data || error.message);
        throw error;
    }
};

export const updatePost = async (
    id: number,
    postData: {
        title: string;
        content: string;
        excerpt?: string;
        tags?: string;
        categoryId: number;
        status?: "DRAFT" | "PENDING" | "PUBLIC";
    },
    thumbnail?: any
) => {
    try {
        const formData = new FormData();

        // Phần JSON "post"
        formData.append("post", JSON.stringify(postData));

        // Phần file "thumbnail" (nếu có)
        if (thumbnail) {
            formData.append("thumbnail", {
                uri: thumbnail.uri,
                name: thumbnail.name,
                type: thumbnail.mimeType || "image/jpeg",
            } as any);
        }

        const res = await apiInstance.put(`/posts/mobile/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        return res.data;
    } catch (error: any) {
        console.error("❌ Lỗi khi cập nhật bài viết:", error.response?.data || error.message);
        throw error;
    }
};

export const deletePost = async (id: number) => {
    try {
        const res = await apiInstance.delete(`/posts/${id}`);
        return res.data;
    } catch (error: any) {
        console.error("❌ Lỗi khi xóa bài viết:", error.response?.data || error.message);
        throw error;
    }
};

