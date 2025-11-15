# Migration Guide - Cập nhật i18n cho toàn bộ project

## ✅ Đã hoàn thành

### Files đã migrate:
- ✅ `SettingScreen.tsx` - Đã thêm LanguageSwitcher và migrate toàn bộ
- ✅ `PostJobScreen.tsx` - Đã migrate validation messages và toast

### Components hỗ trợ:
- ✅ `LanguageSwitcher.tsx` - Component chuyển đổi ngôn ngữ
- ✅ `LanguagePicker.tsx` - Modal picker
- ✅ `useI18n.ts` - Custom hook với utilities

## 🚀 Hướng dẫn migrate nhanh cho các màn hình còn lại

### Bước 1: Import hook
```tsx
import { useI18n } from '../../../hooks/useI18n';

const YourScreen = () => {
  const { t } = useI18n();
  // ... rest of code
}
```

### Bước 2: Thay thế các hardcoded strings

#### Thay header titles:
```tsx
// Trước:
<Text>Đăng nhập</Text>

// Sau:
<Text>{t('auth.login')}</Text>
```

#### Thay buttons:
```tsx
// Trước:
<Button title="Đăng ký" />

// Sau:
<Button title={t('auth.register')} />
```

#### Thay placeholders:
```tsx
// Trước:
<TextInput placeholder="Nhập email" />

// Sau:
<TextInput placeholder={t('auth.email')} />
```

#### Thay toast messages:
```tsx
// Trước:
ToastService.success("Thành công", "Đã lưu!");

// Sau:
ToastService.success(t('common.success'), t('messages.saveSuccess'));
```

## 📋 Translation Keys sẵn có

### Common (dùng chung)
- `common.welcome` - Chào mừng
- `common.loading` - Đang tải
- `common.success` - Thành công
- `common.error` - Lỗi
- `common.save` - Lưu
- `common.cancel` - Hủy
- `common.confirm` - Xác nhận
- `common.delete` - Xóa
- `common.edit` - Chỉnh sửa
- `common.search` - Tìm kiếm
- `common.submit` - Gửi
- `common.back` - Quay lại

### Auth
- `auth.login` - Đăng nhập
- `auth.register` - Đăng ký
- `auth.email` - Email
- `auth.password` - Mật khẩu
- `auth.forgotPassword` - Quên mật khẩu
- `auth.resetPassword` - Đặt lại mật khẩu

### Job
- `job.postJob` - Đăng tin tuyển dụng
- `job.jobTitle` - Tên công việc
- `job.salary` - Lương
- `job.location` - Địa điểm
- `job.applyNow` - Ứng tuyển ngay
- `job.saveJob` - Lưu công việc

### Validation
- `validation.required` - "{{field}} là bắt buộc"
- `validation.invalidEmail` - Email không hợp lệ
- `validation.invalidPhone` - Số điện thoại không hợp lệ

### Messages
- `messages.saveSuccess` - Lưu thành công
- `messages.saveError` - Lỗi khi lưu
- `messages.deleteSuccess` - Xóa thành công
- `messages.updateSuccess` - Cập nhật thành công

## 🔥 Quick Migration Commands

### Tìm tất cả hardcoded Vietnamese strings:
```bash
# PowerShell
Select-String -Path "src/**/*.tsx" -Pattern "[\p{L}àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+" -AllMatches
```

## 📱 Test

1. Mở app
2. Vào Settings
3. Chuyển đổi ngôn ngữ
4. Kiểm tra các màn hình đã migrate

## ⚡ Ưu tiên migrate

### Priority 1 (Đã xong):
- ✅ SettingScreen
- ✅ PostJobScreen (một phần)

### Priority 2 (Cần làm):
- [ ] JobSeekerLoginScreen
- [ ] JobSeekerRegisterScreen
- [ ] EmployerLoginScreen
- [ ] EmployerRegisterScreen

### Priority 3:
- [ ] ExploreScreen
- [ ] JobDetailScreen
- [ ] CVScreen
- [ ] NotificationScreen

### Priority 4:
- [ ] Các màn hình còn lại
- [ ] Components (JobCard, SearchBar, etc.)

## 💡 Tips

1. **Test ngay sau khi migrate**: Đổi ngôn ngữ và xem có lỗi gì không
2. **Dùng common keys**: Tái sử dụng `common.*` cho text chung
3. **Check layout**: Đảm bảo text tiếng Anh dài hơn không làm vỡ UI
4. **Toast/Alert**: Luôn nhớ migrate các messages này

## 🎯 Kết quả mong đợi

Sau khi hoàn thành:
- Toàn bộ app hỗ trợ 2 ngôn ngữ
- User có thể chuyển đổi trong Settings
- Tất cả text được quản lý tập trung trong i18n
- Dễ dàng thêm ngôn ngữ mới sau này
