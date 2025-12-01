import * as WebBrowser from "expo-web-browser";
import * as Crypto from "expo-crypto";
import { Platform } from "react-native";
import apiInstance from "../api/apiInstance";

// Cấu hình Google OAuth
const GOOGLE_CLIENT_ID = "950816482683-ahfnuqa0h3o8b5nps7s5eg558pt5639e.apps.googleusercontent.com";
// Redirect URI cho React Native (dùng custom scheme đã config trong app.json)
const GOOGLE_REDIRECT_URI = "com.anonymous.workifyjobportalreactnative:/oauthredirect";

// Complete the WebBrowser session
WebBrowser.maybeCompleteAuthSession();

/**
 * Generate code verifier và code challenge cho PKCE
 */
const generateCodeChallenge = async () => {
  const codeVerifier = Crypto.randomUUID();
  const codeChallenge = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    codeVerifier,
    { encoding: Crypto.CryptoEncoding.BASE64 }
  );
  
  // Base64 URL encode
  const codeChallengeEncoded = codeChallenge
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return { codeVerifier, codeChallenge: codeChallengeEncoded };
};

/**
 * Mở Google OAuth flow và lấy authorization code
 */
export const promptGoogleAuth = async (): Promise<string> => {
  try {
    const { codeVerifier, codeChallenge } = await generateCodeChallenge();
    
    // Build Google OAuth URL
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent("openid profile email")}&` +
      `code_challenge=${codeChallenge}&` +
      `code_challenge_method=S256&` +
      `access_type=offline&` +
      `prompt=consent`;

    console.log("🔐 [GoogleAuth] Opening auth URL...");
    
    const result = await WebBrowser.openAuthSessionAsync(
      authUrl,
      GOOGLE_REDIRECT_URI
    );

    if (result.type === "success") {
      const { url } = result;
      const params = new URLSearchParams(url.split("?")[1]);
      const code = params.get("code");
      
      if (!code) {
        throw new Error("Không nhận được mã xác thực từ Google");
      }
      
      console.log("✅ [GoogleAuth] Received authorization code");
      return code;
    } else if (result.type === "cancel") {
      throw new Error("Bạn đã hủy đăng nhập");
    } else {
      throw new Error("Đăng nhập thất bại");
    }
  } catch (error: any) {
    console.error("❌ [GoogleAuth] Error:", error);
    throw error;
  }
};

/**
 * Gửi authorization code lên backend để đăng nhập
 */
export const loginWithGoogle = async (authorizationCode: string) => {
  try {
    console.log("📤 [GoogleAuth] Sending code to backend...");
    
    const response = await apiInstance.post(
      "/api/v1/auth/authenticate/google",
      null,
      {
        headers: {
          "G-Code": authorizationCode,
        },
      }
    );

    console.log("✅ [GoogleAuth] Login successful");
    return response.data.data; // TokenResponse<UserResponse>
  } catch (error: any) {
    console.error("❌ [GoogleAuth] Login failed:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Luồng đăng nhập Google hoàn chỉnh
 */
export const googleSignIn = async () => {
  try {
    // Bước 1: Lấy authorization code
    const authCode = await promptGoogleAuth();
    
    // Bước 2: Gửi code lên backend và nhận token
    const authData = await loginWithGoogle(authCode);
    
    return authData;
  } catch (error: any) {
    console.error("❌ [GoogleAuth] Sign in failed:", error);
    throw error;
  }
};
