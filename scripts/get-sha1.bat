@echo off
echo 🔑 Lấy SHA-1 Fingerprint cho Google OAuth
echo ==========================================
echo.

set KEYSTORE_PATH=%USERPROFILE%\.android\debug.keystore

echo 📁 Keystore path: %KEYSTORE_PATH%
echo.

if not exist "%KEYSTORE_PATH%" (
    echo ❌ Debug keystore không tồn tại!
    echo Vui lòng chạy: npx expo prebuild
    exit /b 1
)

echo 🔍 Đang lấy SHA-1 fingerprint...
echo.

keytool -list -v -keystore "%KEYSTORE_PATH%" -alias androiddebugkey -storepass android -keypass android | findstr "SHA1"

echo.
echo ✅ Hoàn tất!
echo.
echo 📋 Copy SHA-1 fingerprint ở trên và paste vào:
echo    Google Cloud Console ^> Credentials ^> Create OAuth Client ID ^> Android
echo.
pause
