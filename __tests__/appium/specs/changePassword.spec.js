const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

global.currentSpecName = path.basename(__filename);
// Load test data from JSON file
const testDataPath = path.join(__dirname, 'data.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

describe('Change Password Functionality', () => {
    // Giả sử app đã mở sẵn màn hình Settings
    before(async () => {
        const firstInput = await $('~currentPasswordInput');
        await firstInput.waitForDisplayed({ timeout: 5000 });
    });

    beforeEach(async () => {
        // Xóa giá trị input trước mỗi test
        const inputIDs = [
            '~currentPasswordInput',
            '~newPasswordInput',
            '~confirmPasswordInput'
        ];

        for (const id of inputIDs) {
            const input = await $(id);
            if (await input.isDisplayed()) {
                await input.clearValue();
            }
        }
    });



    it('2.1 Change password with empty current password', async () => {
        const data = testData.changePassword.emptyCurrent;
        await changePassword(data.current, data.new, data.confirm);
    });

    it('2.2 Change password with empty new password', async () => {
        const data = testData.changePassword.emptyNew;
        await changePassword(data.current, data.new, data.confirm);
    });

    it('2.3 Change password with empty confirm password', async () => {
        const data = testData.changePassword.emptyConfirm;
        await changePassword(data.current, data.new, data.confirm);
    });

    it('2.4 Change password with new password and confirm password mismatch', async () => {
        const data = testData.changePassword.mismatch;
        await changePassword(data.current, data.new, data.confirm);
    });

    it('2.5 Change password with incorrect password format ( < 8 char)', async () => {
        const data = testData.changePassword.shortPassword;
        await changePassword(data.current, data.new, data.confirm);
    });
    it('2.6 Change password with incorrect password format (no special char)', async () => {
        const data = testData.changePassword.noSpecialChar;
        await changePassword(data.current, data.new, data.confirm);
    });
    it('2.7 Change password with incorrect password format (no uppercase)', async () => {
        const data = testData.changePassword.noUppercase;
        await changePassword(data.current, data.new, data.confirm);
    });
    it('2.8 Change password with incorrect password format (no number)', async () => {
        const data = testData.changePassword.noNumber;
        await changePassword(data.current, data.new, data.confirm);
    });
    it('2.9 Change password with incorrect current password', async () => {
        const data = testData.changePassword.incorrectCurrent;
        await changePassword(data.current, data.new, data.confirm);
    });
    it('2.10 Change password successfully', async () => {
        const data = testData.changePassword.success;
        await changePassword(data.current, data.new, data.confirm);
    });
    // ======================
    // Helper function
    // ======================
    async function changePassword(current, newPwd, confirm) {
        const currentInput = await $('~currentPasswordInput');
        await currentInput.setValue(current);

        const newInput = await $('~newPasswordInput');
        await newInput.setValue(newPwd);

        const confirmInput = await $('~confirmPasswordInput');
        await confirmInput.setValue(confirm);

        const changeBtn = await $('~changePasswordBtn');


        await changeBtn.click();
    }
});