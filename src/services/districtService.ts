import apiInstance from "../api/apiInstance";

export type District = {
  id: number;
  code: string;
  name: string;
};

// 1️⃣ Lấy tất cả quận/huyện
export async function getAllDistricts(): Promise<District[]> {
  const response = await apiInstance.get("/districts");
  return response.data.data; // data là mảng District[]
}

// 2️⃣ Lấy danh sách quận/huyện theo tỉnh (provinceId)
export async function getDistrictsByProvince(provinceId: number): Promise<District[]> {
  const response = await apiInstance.get(`/districts/province/${provinceId}`);
  return response.data.data; // data là mảng District[]
}

// 3️⃣ Lấy chi tiết quận/huyện theo id
export async function getDistrictById(id: number): Promise<District> {
  const response = await apiInstance.get(`/districts/${id}`);
  return response.data.data; // data là object District
}
