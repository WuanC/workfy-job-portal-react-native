import apiInstance from "../api/apiInstance";

export interface Industry {
    id: number;
    name: string;
    engName: string;
    description: string | null;
}
export interface IndustryWithJobCount {
    id: number;
    name: string;
    engName: string;
    description: string | null;
    jobCount: number;
}

// Interface mô tả từng CategoryJob
export interface CategoryJob {
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    engName: string;
    description: string | null;
    industries: IndustryWithJobCount[];
}
export const getAllIndustries = async () => {
    try {
        const res = await apiInstance.get("/industries/all");
        return res.data.data as Industry[];
    } catch (error: any) {
        console.error("Lỗi khi lấy industries:", error.response?.data || error.message);
        throw error;
    }
};
export const getIndustriesJobCount = async () => {
    try {
        const res = await apiInstance.get("/categories-job/industries/job-count");
        return res.data.data as CategoryJob[];
    } catch (error: any) {
        console.error("Lỗi khi lấy danh sách ngành nghề theo danh mục:", error.response?.data || error.message);
        throw error;
    }
};
