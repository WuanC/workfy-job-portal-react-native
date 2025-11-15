# Appium Testing cho PostJobScreen

## Cài đặt môi trường

### 1. Cài đặt Appium
```bash
npm install -g appium
appium driver install uiautomator2
```

### 2. Kiểm tra Appium hoạt động
```bash
appium
```

### 3. Kết nối Android Device/Emulator
- Bật USB Debugging trên thiết bị Android
- Hoặc khởi động Android Emulator
- Kiểm tra device đã kết nối:
```bash
adb devices
```

### 4. Tải APK từ EAS Build
- Truy cập: https://expo.dev/accounts/bo11082007/projects/workify-job-portal-react-native/builds/8cd59b12-dc86-4ec0-b9af-2d918a9aea88
- Tải file APK về
- Đặt file APK vào thư mục gốc dự án với tên `app-debug.apk`
- Hoặc cập nhật đường dẫn trong `wdio.conf.js`

### 5. Cấu hình wdio.conf.js
Cập nhật các thông tin sau trong `wdio.conf.js`:
- `appium:deviceName`: Tên device của bạn (xem bằng `adb devices`)
- `appium:platformVersion`: Version Android của device
- `appium:app`: Đường dẫn đến file APK

## Cấu trúc thư mục test

```
__tests__/
└── appium/
    ├── helpers/
    │   └── TestHelper.js          # Helper functions cho testing
    ├── pageobjects/
    │   └── PostJobScreen.page.js  # Page Object Model cho PostJobScreen
    └── specs/
        └── PostJobScreen.spec.js  # Test cases
```

## Test Cases đã implement

### TC01 - Validation: Không nhập tên công ty
- **Mục đích**: Kiểm tra validation khi không nhập tên công ty
- **Expected**: Hiển thị toast "Vui lòng nhập tên công ty"

### TC02 - Validation: Không chọn quy mô công ty
- **Mục đích**: Kiểm tra validation khi không chọn quy mô
- **Expected**: Hiển thị toast "Vui lòng chọn quy mô công ty"

### TC03 - Validation: Không nhập tên công việc
- **Mục đích**: Kiểm tra validation khi không nhập tên job
- **Expected**: Hiển thị toast "Vui lòng nhập tên công việc"

### TC04 - Validation: Số điện thoại không hợp lệ
- **Mục đích**: Kiểm tra validation số điện thoại
- **Expected**: Hiển thị toast "Sai định dạng"

### TC05 - Validation: Mức lương không hợp lệ (Min >= Max)
- **Mục đích**: Kiểm tra validation khi min salary >= max salary
- **Expected**: Hiển thị toast "Vui lòng nhập mức lương hợp lệ"

### TC06 - Happy Path: Tạo job thành công với lương "Trên"
- **Mục đích**: Tạo job với đầy đủ thông tin, lương kiểu "Trên X"
- **Expected**: Tạo thành công, hiển thị toast "Thành công"

### TC07 - Happy Path: Tạo job thành công với lương "Trong khoảng"
- **Mục đích**: Tạo job với lương kiểu "X - Y"
- **Expected**: Tạo thành công

### TC08 - Happy Path: Tạo job thành công với lương "Thỏa thuận"
- **Mục đích**: Tạo job với lương thỏa thuận
- **Expected**: Tạo thành công

### TC09 - Validation: Không chọn phúc lợi
- **Mục đích**: Kiểm tra validation khi không chọn benefit
- **Expected**: Hiển thị toast "Phúc lợi không được để trống"

### TC10 - Navigation: Kiểm tra nút Back
- **Mục đích**: Kiểm tra chức năng quay lại màn hình trước
- **Expected**: Quay lại thành công

## Chạy tests

### Chạy tất cả tests
```bash
npx wdio run wdio.conf.js
```

### Chạy 1 test file cụ thể
```bash
npx wdio run wdio.conf.js --spec __tests__/appium/specs/PostJobScreen.spec.js
```

### Chạy 1 test case cụ thể
```bash
npx wdio run wdio.conf.js --spec __tests__/appium/specs/PostJobScreen.spec.js --mochaOpts.grep "TC06"
```

## Page Object Model

### PostJobScreen.page.js
Chứa các methods:
- `fillCompanyInfo(data)` - Điền thông tin công ty
- `fillJobBasicInfo(data)` - Điền thông tin công việc cơ bản
- `fillSalaryInfo(data)` - Điền thông tin lương
- `selectBenefits(benefits)` - Chọn phúc lợi
- `fillJobDetails(data)` - Điền chi tiết công việc
- `fillContactInfo(data)` - Điền thông tin liên hệ
- `clickSubmit()` - Click nút submit
- `verifySuccessToast()` - Verify toast thành công
- `verifyErrorToast(message)` - Verify toast lỗi

### TestHelper.js
Chứa các helper methods:
- `scrollToElement(selector, maxScrolls)` - Scroll để tìm element
- `scrollToTop()` - Scroll lên đầu trang
- `setValueWithScroll(selector, text)` - Nhập text với scroll
- `clickWithScroll(selector)` - Click với scroll
- `selectDropdownOption(dropdownSelector, optionText)` - Chọn dropdown
- `waitForToast(message, timeout)` - Đợi toast
- `takeScreenshot(filename)` - Chụp màn hình
- `waitForLoadingComplete()` - Đợi loading

## Lưu ý quan trọng

### 1. Locator Strategy
- Sử dụng `UiSelector` của Android cho các element
- Ưu tiên tìm theo text nếu có
- Fallback sang accessibility ID hoặc resource ID

### 2. Scroll Strategy
- App sử dụng ScrollView nên cần scroll để tìm elements
- Sử dụng `mobile: scrollGesture` của Appium
- Helper đã handle scroll tự động

### 3. Timing Issues
- Thêm `driver.pause()` sau các actions quan trọng
- Sử dụng `waitForDisplayed()` cho các elements
- Đợi dropdown load data (provinces, districts)

### 4. Keyboard Handling
- Ẩn keyboard sau khi nhập text để tránh che elements
- Sử dụng `driver.hideKeyboard()`

### 5. Test Data
- Sử dụng data realistic để test
- Test các edge cases: empty, invalid format, boundary values

## Troubleshooting

### Lỗi "Element not found"
- Kiểm tra app đã load xong chưa
- Thử tăng timeout trong `waitForDisplayed()`
- Kiểm tra locator selector có đúng không
- Thử scroll để tìm element

### Lỗi "Session not created"
- Kiểm tra Appium server đã chạy chưa
- Kiểm tra device đã connect chưa (`adb devices`)
- Kiểm tra capabilities trong wdio.conf.js

### Lỗi "App not installed"
- Kiểm tra đường dẫn APK trong wdio.conf.js
- Kiểm tra APK file có tồn tại không
- Thử cài thủ công: `adb install app-debug.apk`

### Test chạy chậm
- Giảm số lần scroll tối đa
- Giảm thời gian pause
- Tối ưu locator strategy

## Mở rộng

### Thêm test cases mới
1. Tạo method mới trong Page Object nếu cần
2. Viết test case trong spec file
3. Sử dụng các helper có sẵn
4. Follow naming convention: TC[số] - [mô tả ngắn]

### Test API kết hợp
- Có thể dùng axios để verify data trên server
- Import services từ `src/services/`
- Verify job đã được tạo trong database

### CI/CD Integration
- Chạy tests trên cloud devices (BrowserStack, Sauce Labs)
- Integrate vào GitHub Actions
- Generate reports tự động

## Scripts hữu ích

Thêm vào `package.json`:
```json
{
  "scripts": {
    "test:appium": "wdio run wdio.conf.js",
    "test:appium:spec": "wdio run wdio.conf.js --spec",
    "appium": "appium",
    "adb:devices": "adb devices",
    "adb:install": "adb install -r app-debug.apk"
  }
}
```
