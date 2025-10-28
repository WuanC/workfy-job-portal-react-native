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

