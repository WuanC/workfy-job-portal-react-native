import apiInstance from "../api/apiInstance";

export interface Industry {
  id: number;
  name: string;
  engName: string;
  description: string | null;
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
