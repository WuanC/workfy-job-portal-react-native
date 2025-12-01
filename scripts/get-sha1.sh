#!/bin/bash

echo "🔑 Lấy SHA-1 Fingerprint cho Google OAuth"
echo "=========================================="
echo ""

# Check if running on Windows
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    KEYSTORE_PATH="$USERPROFILE\\.android\\debug.keystore"
else
    KEYSTORE_PATH="$HOME/.android/debug.keystore"
fi

echo "📁 Keystore path: $KEYSTORE_PATH"
echo ""

if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "❌ Debug keystore không tồn tại!"
    echo "Vui lòng chạy: npx expo prebuild"
    exit 1
fi

echo "🔍 Đang lấy SHA-1 fingerprint..."
echo ""

keytool -list -v -keystore "$KEYSTORE_PATH" -alias androiddebugkey -storepass android -keypass android | grep SHA1

echo ""
echo "✅ Hoàn tất!"
echo ""
echo "📋 Copy SHA-1 fingerprint ở trên và paste vào:"
echo "   Google Cloud Console > Credentials > Create OAuth Client ID > Android"
echo ""
