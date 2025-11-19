const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
global.currentSpecName = path.basename(__filename);
// Load test data from JSON file
const testDataPath = path.join(__dirname, 'data.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));

describe('Login Functionality', () => {

    before(async () => {
        const emailInput = await $('~emailInput');

        await emailInput.waitForDisplayed({ timeout: 5000 });
    });

    beforeEach(async () => {
        const inputs = ['~emailInput', '~passwordInput'];
        for (const id of inputs) {
            const input = await $(id);
            if (await input.isDisplayed()) {
                await input.clearValue();
            }
        }
    });
    it('1.1 Login with empty email', async () => {
        const data = testData.login.emptyEmail;
        await login(data.email, data.password);
    });


    it('1.2 Login with empty password', async () => {
        const data = testData.login.emptyPassword;
        await login(data.email, data.password);
    });

    it('1.3 Login with invalid email format', async () => {
        const data = testData.login.invalidEmail;
        await login(data.email, data.password);
    });

    it('1.4 Login with incorrect password format (< 8 char)', async () => {
        const data = testData.login.shortPassword;
        await login(data.email, data.password);
    });
    it('1.5 Login with incorrect password format (no special char)', async () => {
        const data = testData.login.noSpecialCharPassword;
        await login(data.email, data.password);
    });
    it('1.6 Login with incorrect password format (no uppercase)', async () => {
        const data = testData.login.noUppercasePassword;
        await login(data.email, data.password);
    });
    it('1.7 Login with incorrect password format (no number)', async () => {
        const data = testData.login.noNumberPassword;
        await login(data.email, data.password);
    });
    it('1.8 Login with incorrect password', async () => {
        const data = testData.login.incorrectPassword;
        await login(data.email, data.password);
    });
    it('1.9 Login with valid credentials', async () => {
        const data = testData.login.validCredentials;
        await login(data.email, data.password);
    });
    async function login(email, password) {
        const emailInput = await $('~emailInput');
        await emailInput.setValue(email);

        const passwordInput = await $('~passwordInput');
        await passwordInput.setValue(password);

        const loginBtn = await $('~loginBtn');
        await loginBtn.click();

    }
});
