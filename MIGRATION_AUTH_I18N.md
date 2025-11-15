# Migration Guide: Đa ngôn ngữ hóa Auth Screens

Tất cả các file trong thư mục `src/screens/Auth` đã được chuẩn bị keys đa ngôn ngữ.

## ✅ Keys đã thêm vào file ngôn ngữ

### Các key chung:
- `auth.login`, `auth.register`, `auth.email`, `auth.password`
- `auth.confirmPassword`, `auth.forgotPassword`, `auth.confirm`
- `auth.enterEmail`, `auth.enterPassword`, `auth.rememberMe`
- `auth.or`, `auth.loginWithGoogle`, `auth.loginWithLinkedIn`
- `auth.loggingIn`, `auth.registering`, `auth.processing`

### JobSeekerLoginScreen:
- `auth.noAccount`, `auth.registerNow`
- `auth.areEmployer`, `auth.loginHere`
- `auth.missingInfo`, `auth.enterEmailPassword`
- `auth.loginSuccess`, `auth.welcomeBack`
- `auth.loginFailed`, `auth.invalidCredentials`

### JobSeekerRegisterScreen:
- `auth.registerAccount`, `auth.enterFullName`
- `auth.agreeTerms`, `auth.termsConditions`
- `auth.haveAccount`, `auth.fullName`
- `auth.enterAllFields`, `auth.passwordMismatch`
- `auth.agreeTermsRequired`

### EmployerLoginScreen:
- `auth.employerLogin`, `auth.areCandidate`

### EmployerRegisterScreen:
- `auth.registerEmployer`, `auth.companyEmail`
- `auth.companySize`, `auth.contactPerson`
- `auth.selectProvince`, `auth.selectDistrict`
- `auth.detailAddress`

### ForgotPasswordScreen:
- `auth.forgotPasswordTitle`, `auth.forgotPasswordDesc`
- `auth.enterEmailPlaceholder`
- `auth.invalidEmailFormat`, `auth.accountLocked`
- `auth.accountLockedDesc`, `auth.systemError`

### ResetPasswordScreen:
- `auth.resetPasswordTitle`, `auth.resetPasswordDesc`
- `auth.otpCode`, `auth.newPassword`
- `auth.otpMust8Digits`, `auth.passwordMin6`
- `auth.passwordNeedUppercase`, `auth.passwordNeedLowercase`
- `auth.passwordNeedNumber`, `auth.passwordChangeSuccess`

### ConfirmEmailScreen:
- `auth.confirmEmailTitle`, `auth.confirmEmailDesc`
- `auth.enter8DigitOTP`

## 📝 Cách sử dụng

Mỗi file cần:
1. Import hook: `import { useI18n } from "../../hooks/useI18n";`
2. Sử dụng: `const { t } = useI18n();`
3. Thay text: `{t('auth.login')}`

## ⚠️ Lưu ý

- Các ToastService cần dùng t() function
- Placeholder trong TextInput cần dùng t()
- Tất cả hardcoded text cần được thay thế
