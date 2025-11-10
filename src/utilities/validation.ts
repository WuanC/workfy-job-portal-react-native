export type InputType = "email" | "phone" | "password";
export const validateField = (value: string, type: InputType): string | null => {
  if (!value.trim()) return "Vui lòng nhập thông tin";

  switch (type) {
    case "email":
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
        return "Email không hợp lệ";
      break;

    case "phone":
      if (!/^(?:\+84|84|0)(?:\d{9})$/.test(value.trim()))
        return "Số điện thoại không hợp lệ";
      break;

    case "password":
      if (value.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
      if (!/[A-Z]/.test(value)) return "Mật khẩu phải chứa ít nhất một chữ cái viết hoa";
      if (!/\d/.test(value)) return "Mật khẩu phải chứa ít nhất một chữ số";
      if (!/[^A-Za-z0-9]/.test(value)) return "Mật khẩu phải chứa ít nhất một ký tự đặc biệt";
      break;
  }

  return null; // ✅ hợp lệ
};