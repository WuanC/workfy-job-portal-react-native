import apiInstance from "../api/apiInstance";
import * as DocumentPicker from "expo-document-picker";
type ApplicationRequest = {
  fullName: string;
  email: string;
  phoneNumber?: string;
  coverLetter?: string;
  jobId: number;
  cvUrl?: string;
};

type ApplicationResponse = any;

/**
 * Minimal mime type lookup for common CV/file extensions used by the app.
 */
function guessMimeType(filename: string) {
  const ext = (filename.split(".").pop() || "").toLowerCase();
  switch (ext) {
    case "pdf":
      return "application/pdf";
    case "doc":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "heic":
      return "image/heic";
    default:
      return "application/octet-stream";
  }
}

async function getMimeTypeFromUri(uri: string): Promise<string | undefined> {
  try {
    // Try to fetch the resource and inspect blob.type
    const resp = await fetch(uri);
    // Some platforms may not support blob(); if not, this will throw and we'll fallback
    const blob = await resp.blob();
    if (blob && blob.type) return blob.type;
  } catch (e) {
    // ignore and fallback
  }
  return undefined;
}

/**
 * Apply for a job by uploading a CV file (multipart/form-data).
 * Parts expected by backend:
 *  - application: JSON string of ApplicationRequest
 *  - cv: file
 */
export async function applyWithFileCV(
  application: ApplicationRequest,
  cvUri: string
): Promise<ApplicationResponse> {
  const formData = new FormData();

  // application part must be JSON string
  formData.append("application", JSON.stringify(application));

  // prepare file part
  const fileName = cvUri.split("/").pop() || "cv";
  // Try to guess mime type from filename first, then attempt to detect from URI
  let mimeType = guessMimeType(fileName);
  if (!mimeType || mimeType === "application/octet-stream") {
    const detected = await getMimeTypeFromUri(cvUri);
    if (detected) mimeType = detected;
  }

  // Build file object for React Native FormData
  // @ts-ignore
  const fileObj = { uri: cvUri, name: fileName, type: mimeType || "application/octet-stream" };
  // @ts-ignore
  formData.append("cv", fileObj);

  // IMPORTANT: do NOT set the Content-Type header here. Let the underlying XMLHttpRequest
  // set the multipart boundary automatically. Setting `multipart/form-data` without boundary
  // will result in incorrect requests and some servers may treat parts as application/octet-stream.
  const res = await apiInstance.post("/applications", formData);

  return res.data;
}

/**
 * Apply for a job by sending a CV link (JSON body). Backend must expose an endpoint
 * that accepts JSON. If your backend uses the same path for link-based applies,
 * adjust the URL accordingly.
 */
export async function applyWithLinkCV(
  application: ApplicationRequest
): Promise<ApplicationResponse> {
  // Attach cvUrl in the body
  const res = await apiInstance.post("/applications/link", application);
  return res.data;
}

export default { applyWithFileCV, applyWithLinkCV };



export const uploadFile = async () => {
  try {
    // 1️⃣ Chọn file
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "image/*",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    });

    if (result.canceled) return;

    const file = result.assets[0];
    console.log("📁 File chọn:", file);

    // 2️⃣ Tạo form data
    const formData = new FormData();
    formData.append("cv", {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || "application/octet-stream",
    } as any);

    // 3️⃣ Gửi lên server
    const response = await apiInstance.post(
      "/test",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("✅ Upload thành công:", response.data);
  } catch (error) {
    console.error("❌ Lỗi upload:", error);
  }
};

export const applyWithFileCV1 = async (
  application: {
    fullName: string;
    email: string;
    phoneNumber: string;
    coverLetter: string;
    jobId: number;
  },
  file: any
) => {
  try {
    const formData = new FormData();

    // Phần JSON "application"
    formData.append("application", JSON.stringify(application));

    // Phần file "cv"
    // const filename = cvUri.split("/").pop() || "cv.pdf";
    // const match = /\.(\w+)$/.exec(filename);
    // const type = match ? `application/${match[1]}` : `application/pdf`;

    formData.append("cv", {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || "application/octet-stream",
    } as any);

    const res = await apiInstance.post("/applications", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.data; // ApplicationResponse.data
  } catch (error: any) {
    console.error("❌ Lỗi khi ứng tuyển bằng file CV:", error.response?.data || error.message);

    // Xử lý lỗi cụ thể
    switch (error.response?.status) {
      case 400:
        throw new Error("Dữ liệu hoặc file không hợp lệ.");
      case 401:
        throw new Error("Bạn cần đăng nhập để ứng tuyển.");
      case 403:
        throw new Error("Bạn không có quyền ứng tuyển công việc này.");
      case 404:
        throw new Error("Công việc không tồn tại hoặc chưa được duyệt.");
      case 409:
        throw new Error("Bạn đã đạt giới hạn số lần ứng tuyển cho công việc này.");
      default:
        throw new Error("Không thể gửi ứng tuyển.");
    }
  }
};
