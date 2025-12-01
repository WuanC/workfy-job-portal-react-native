#!/usr/bin/env node

/**
 * Script để lấy SHA-1 và SHA-256 từ EAS credentials
 * Chạy: node scripts/get-eas-sha.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Đang lấy thông tin credentials từ EAS...\n');

try {
  // Kiểm tra xem đã login EAS chưa
  try {
    execSync('eas whoami', { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ Bạn chưa đăng nhập EAS CLI');
    console.log('📝 Chạy lệnh: eas login');
    process.exit(1);
  }

  console.log('✅ Đã đăng nhập EAS\n');
  console.log('📋 Hướng dẫn lấy SHA-1 và SHA-256:\n');
  console.log('1️⃣  Chạy lệnh sau để xem credentials:');
  console.log('   eas credentials\n');
  console.log('2️⃣  Chọn: Android -> View credentials -> Keystore\n');
  console.log('3️⃣  Bạn sẽ thấy thông tin:');
  console.log('   - SHA-1 Fingerprint');
  console.log('   - SHA-256 Fingerprint\n');
  console.log('4️⃣  Copy các fingerprints này và thêm vào Google Cloud Console\n');
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📝 HOẶC tự động download keystore và lấy SHA (Advanced):');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('   eas credentials');
  console.log('   → Android → Download credentials → Keystore\n');
  console.log('Sau khi download, chạy lệnh:');
  console.log('   keytool -list -v -keystore workify.keystore\n');

} catch (error) {
  console.error('❌ Lỗi:', error.message);
  process.exit(1);
}
