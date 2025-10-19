import apiInstance from "../api/apiInstance";

export type Province = {
  id: number;
  code: string;
  name: string;
  engName: string;
};
export const getAllProvince = async () => {
    try {
        const res = await apiInstance.get("/provinces");
        return res.data.data as Province[];
    } catch (error: any) {
        console.error("Lỗi khi lấy industries:", error.response?.data || error.message);
        throw error;
    }
};
export const getProvinceById = async (id: number): Promise<Province> => {
  try {
    const res = await apiInstance.get(`/provinces/${id}`);
    return res.data.data as Province;
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.error("Tỉnh thành không tồn tại");
    } else if (error.response?.status === 400) {
      console.error("ID không hợp lệ");
    } else {
      console.error("Lỗi khi lấy tỉnh thành:", error.response?.data || error.message);
    }
    throw error;
  }
};