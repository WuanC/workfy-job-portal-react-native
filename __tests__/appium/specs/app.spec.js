const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

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
        const homeScreen = await $('~homeScreen');
        expect(await homeScreen.isDisplayed()).to.be.true;
        const settingBtn = await $('~settingsTab');
        await settingBtn.waitForDisplayed({ timeout: 2000 });
        await settingBtn.click();
    });
    // ======================
    // Helper function
    // ======================
    async function login(email, password) {
        const emailInput = await $('~emailInput');
        await emailInput.setValue(email);

        const passwordInput = await $('~passwordInput');
        await passwordInput.setValue(password);

        const loginBtn = await $('~loginBtn');
        await loginBtn.click();

    }
});

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
        const settingBtn = await $('~jobTab');
        await settingBtn.waitForDisplayed({ timeout: 2000 });
        await settingBtn.click();
        await driver.pause(5000);
        const addBtn = await $('~addBtn');
        await addBtn.waitForDisplayed({ timeout: 5000 });
        await addBtn.click();
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
describe('Post Job', () => {
    before(async () => {
        const companyNameInput = await $('~companyNameInput');
        await companyNameInput.waitForDisplayed({ timeout: 5000 });
    });


    // ========== FILL SEQUENTIAL TESTS (Top to Bottom) ==========
    it('3.1 Empty company name', async () => {
        const companyNameInput = await $('~companyNameInput');
        await companyNameInput.waitForDisplayed({ timeout: 2000 });
        await companyNameInput.clearValue();

        await postJob({ companyName: testData.postJob.invalid.emptyCompanyName });
    });


    it('3.2 Empty about company', async () => {
        const companyNameInput = await $('~companyNameInput');
        await companyNameInput.setValue(testData.postJob.valid.companyName);
        await postJob({ aboutCompany: testData.postJob.invalid.emptyAboutCompany });
    });
    it('3.3 Emty job title', async () => {
        await postJob({ aboutCompany: testData.postJob.valid.aboutCompany });
    });

    it('3.4 Empty job province', async () => {
        await fastScrollDown();
        await fastScrollDown();
        await postJob({ jobTitle: testData.postJob.valid.jobTitle });
    });

    it('3.5 Empty job district', async () => {
        await postJob({ jobProvinceId: testData.postJob.valid.jobProvinceId });
    });

    it('3.6 Empty job detail address', async () => {
        await postJob({ jobDistrictId: testData.postJob.valid.jobDistrictId });
    });

    it('3.7 Empty salary type', async () => {
        await postJob({ jobDetailAddress: testData.postJob.valid.jobDetailAddress });
    });

    it('3.8 Empty min - max salary', async () => {
        await fastScrollDown();
        await fastScrollDown();
        await postJob({ salaryType: testData.postJob.valid.salaryType });
    });

    it('3.9 Min salary not greater max salary', async () => {
        const invalid = testData.postJob.invalid.minGreaterMaxSalary;
        await postJob({ minSalary: invalid.minSalary, maxSalary: invalid.maxSalary, salaryUnit: testData.postJob.valid.salaryUnit });
    });
    it('3.10 Min salary and max salary is not negative number', async () => {
        const invalid = testData.postJob.invalid.negativeSalary;
        await postJob({ minSalary: invalid.minSalary, maxSalary: invalid.maxSalary, salaryUnit: testData.postJob.valid.salaryUnit });
    });
    it('3.11 Empty job description', async () => {
        await postJob({ minSalary: testData.postJob.valid.minSalary, maxSalary: testData.postJob.valid.maxSalary, salaryUnit: testData.postJob.valid.salaryUnit });
    });


    it('3.12 Empty job requirement', async () => {
        await postJob({ jobDescription: testData.postJob.valid.jobDescription });
    });

    it('3.13 Empty benefits', async () => {
        await postJob({ requirement: testData.postJob.valid.requirement });
    });

    it('3.14 Empty benefits description', async () => {

        await fastScrollDown();
        await fastScrollDown();
        await postJob({ benefits: testData.postJob.valid.benefits });
    });

    it('3.14 Empty edutcation', async () => {
        const valid = testData.postJob.valid;
        await postJob({ benefits: testData.postJob.valid.benefits, benefit1: valid.benefit1, benefit2: valid.benefit2 });
    });

    it('3.15 Empty experience', async () => {

        await fastScrollDown();
        await fastScrollDown();
        await postJob({ education: testData.postJob.valid.education });
    });

    it('3.16 Empty job level', async () => {
        await postJob({ experience: testData.postJob.valid.experience });
    });
    it('3.18 Empty job type', async () => {
        await postJob({ jobLevel: testData.postJob.valid.jobLevel });
    });
    it('3.19 Empty gender', async () => {
        await postJob({ jobType: testData.postJob.valid.jobType });
    });
    it('3.20 Empty industries', async () => {
        await fastScrollDown();
        await postJob({ gender: testData.postJob.valid.gender });
    });
    it('3.21 Empty age type', async () => {
        await fastScrollDown();
        await postJob({ industries: testData.postJob.valid.industries });
    });

    it('3.22 Min age and max age are not filled', async () => {
        await postJob({ ageType: testData.postJob.valid.ageType });
    });
    it('3.23 Min age is not greater than max age', async () => {
        const invalid = testData.postJob.invalid.minGreaterMaxAge;
        await postJob({ minAge: invalid.minAge, maxAge: invalid.maxAge });
    });
    it('3.24 Min age and max age is not negative number', async () => {
        const invalid = testData.postJob.invalid.negativeAge;
        await postJob({ minAge: invalid.minAge, maxAge: invalid.maxAge });
    });
    it('3.25 Empty contact name', async () => {
        await postJob({ minAge: testData.postJob.valid.minAge, maxAge: testData.postJob.valid.maxAge });
    });
    it('3.26 Empty contact phone', async () => {
        await fastScrollDown();
        await postJob({ contactName: testData.postJob.valid.contactName });
    });
    it('3.27 Contact phone is not phone number', async () => {
        await fastScrollDown();
        await postJob({ contactPhone: testData.postJob.invalid.invalidContactPhone });
    });
    it('3.28 Empty contact province', async () => {
        await fastScrollDown();
        await postJob({ contactPhone: testData.postJob.valid.contactPhone });
    });
    it('3.29 Empty contact district', async () => {
        await fastScrollDown();
        await fastScrollDown();
        await fastScrollDown();
        await fastScrollDown();
        await postJob({ contactProvinceId: testData.postJob.valid.contactProvinceId });
    });
    it('3.30 Empty contact detail address', async () => {
        await postJob({ contactDistrictId: testData.postJob.valid.contactDistrictId });
    });
    it('3.31 Empty contact description', async () => {
        await postJob({ contactDetailAddress: testData.postJob.valid.contactDetailAddress });
    });
    it('3.32 Post success', async () => {
        await postJob({ description: testData.postJob.valid.description });
    });
    // ======================
    // Helper function
    // ======================
    async function postJob(data) {
        // Company Name
        if (data.companyName !== undefined && data.companyName !== '') {
            const companyNameInput = await $('~companyNameInput');
            await companyNameInput.waitForDisplayed({ timeout: 2000 });
            await companyNameInput.setValue(data.companyName);
        }

        //Company Size
        if (data.companySize) {
            const companySizeDropdown = await $('~companySizeDropdown');
            await companySizeDropdown.click();
            const companySizeOption = await $(`~companySize_${data.companySize}`);
            await companySizeOption.click();
        }

        //Company Website
        if (data.companyWebsite !== undefined && data.companyWebsite !== '') {
            const companyWebsiteInput = await $('~companyWebsiteInput');
            await companyWebsiteInput.setValue(data.companyWebsite);
        }

        // About Company (RichEditor - giả sử set HTML)
        if (data.aboutCompany !== undefined && data.aboutCompany !== '') {
            const aboutCompanyEditor = await $('~aboutCompanyEditor');
            await aboutCompanyEditor.setValue(data.aboutCompany);
        }

        // Job Title
        if (data.jobTitle !== undefined && data.jobTitle !== '') {
            const jobTitleInput = await $('~jobTitleInput');
            await jobTitleInput.setValue(data.jobTitle);
        }

        // Job Province
        if (data.jobProvinceId) {
            const provinceDropdown = await $('~provinceDropdown');
            await provinceDropdown.click();
            const provinceOption = await $(`~province_${data.jobProvinceId}`);
            await provinceOption.click();
        }

        // Job District
        if (data.jobDistrictId) {
            const districtDropdown = await $('~districtDropdown');
            await districtDropdown.click();
            const districtOption = await $(`~district_${data.jobDistrictId}`);
            await districtOption.click();
        }

        // Job Detail Address
        if (data.jobDetailAddress !== undefined && data.jobDetailAddress !== '') {
            const jobDetailAddressInput = await $('~jobDetailAddressInput');
            await jobDetailAddressInput.setValue(data.jobDetailAddress);
        }

        // Salary Type
        if (data.salaryType) {
            const salaryTypeDropdown = await $('~salaryTypeDropdown');
            await salaryTypeDropdown.click();
            const salaryTypeOption = await $(`~salaryType_${data.salaryType}`);
            await salaryTypeOption.click();
        }

        // Min Salary
        if (data.minSalary !== undefined && data.minSalary !== '') {
            const minSalaryInput = await $('~minSalaryInput');
            await minSalaryInput.clearValue();
            await minSalaryInput.setValue(data.minSalary);
        }

        // Max Salary
        if (data.maxSalary !== undefined && data.maxSalary !== '') {
            const maxSalaryInput = await $('~maxSalaryInput');
            await maxSalaryInput.clearValue();
            await maxSalaryInput.setValue(data.maxSalary);
        }

        // Salary Unit
        if (data.salaryUnit) {
            const salaryUnitDropdown = await $('~salaryUnitDropdown');
            await salaryUnitDropdown.click();
            const salaryUnitOption = await $(`~salaryUnit_${data.salaryUnit}`);
            await salaryUnitOption.click();
        }



        // Job Description (RichEditor)
        if (data.jobDescription !== undefined && data.jobDescription !== '') {
            const jobDescriptionEditor = await $('~jobDescriptionEditor');
            await jobDescriptionEditor.setValue(data.jobDescription);
        }

        // Requirement (RichEditor)
        if (data.requirement !== undefined && data.requirement !== '') {
            const requirementEditor = await $('~requirementEditor');
            await requirementEditor.setValue(data.requirement);
        }

        // Benefits
        if (data.benefits && data.benefits.length > 0 && data.benefit1 == null) {
            const benefitsMultiSelect = await $('~benefitsMultiSelect');
            await benefitsMultiSelect.click();
            for (const benefit of data.benefits) {
                const benefitOption = await $(`~benefit_${benefit}`);
                await benefitOption.click();
            }
            try {
                await driver.back();
            } catch (e) { }

        }
        if (data.benefits && data.benefits.length > 0
            && data.benefit1 !== undefined && data.benefit1 !== ''
            && data.benefit2 !== undefined && data.benefit2 !== ''
        ) {

            const benefi1 = await $(`~benefitDescription_${data.benefits[0]}`);
            await benefi1.setValue(data.benefit1);

            const benefi2 = await $(`~benefitDescription_${data.benefits[1]}`);
            await benefi2.setValue(data.benefit2);
        }



        // Education
        if (data.education) {
            const educationDropdown = await $('~educationDropdown');
            await educationDropdown.click();
            const educationOption = await $(`~education_${data.education}`);
            await educationOption.click();
        }

        // Experience
        if (data.experience) {
            const experienceDropdown = await $('~experienceDropdown');
            await experienceDropdown.click();
            const experienceOption = await $(`~experience_${data.experience}`);
            await experienceOption.click();
        }

        // Job Level
        if (data.jobLevel) {
            const jobLevelDropdown = await $('~jobLevelDropdown');
            await jobLevelDropdown.click();
            const jobLevelOption = await $(`~jobLevel_${data.jobLevel}`);
            await jobLevelOption.click();
        }

        // Job Type
        if (data.jobType) {
            const jobTypeDropdown = await $('~jobTypeDropdown');
            await jobTypeDropdown.click();
            const jobTypeOption = await $(`~jobType_${data.jobType}`);
            await jobTypeOption.click();
        }

        // Job Gender
        if (data.gender) {
            const genderDropdown = await $('~genderDropdown');
            await genderDropdown.click();
            const genderOption = await $(`~gender_${data.gender}`);
            await genderOption.click();
        }

        // Job Code
        if (data.jobCode !== undefined && data.jobCode !== '') {
            const jobCodeInput = await $('~jobCodeInput');
            await jobCodeInput.setValue(data.jobCode);
        }

        // Industries
        if (data.industries && data.industries.length > 0) {
            const industryDropdown = await $('~industryDropdown');
            await industryDropdown.click();
            for (const industry of data.industries) {
                const industryOption = await $(`~industry_${industry}`);
                await industryOption.click();
            }
        }

        // Age Type
        if (data.ageType) {
            const ageTypeDropdown = await $('~ageTypeDropdown');
            await ageTypeDropdown.click();
            const ageTypeOption = await $(`~ageType_${data.ageType}`);
            await ageTypeOption.click();
        }

        // Min Age
        if (data.minAge !== undefined && data.minAge !== '') {
            const minAgeInput = await $('~minAgeInput');
            await minAgeInput.setValue(data.minAge);
        }

        // Max Age
        if (data.maxAge !== undefined && data.maxAge !== '') {
            const maxAgeInput = await $('~maxAgeInput');
            await maxAgeInput.setValue(data.maxAge);
        }

        // Scroll down


        // Contact Name
        if (data.contactName !== undefined && data.contactName !== '') {
            const contactNameInput = await $('~contactNameInput');
            await contactNameInput.setValue(data.contactName);
        }

        // Contact Phone
        if (data.contactPhone !== undefined && data.contactPhone !== '') {
            const contactPhoneInput = await $('~contactPhoneInput');
            await contactPhoneInput.setValue(data.contactPhone);
        }

        // Contact Province
        if (data.contactProvinceId) {
            const contactProvinceDropdown = await $('~contactProvinceDropdown');
            await driver.pause(500);
            await contactProvinceDropdown.click();
            const contactProvinceOption = await $(`~contactProvince_${data.contactProvinceId}`);
            await contactProvinceOption.click();
        }

        // Contact District
        if (data.contactDistrictId) {
            const contactDistrictDropdown = await $('~contactDistrictDropdown');
            await driver.pause(500);
            await contactDistrictDropdown.click();
            const contactDistrictOption = await $(`~contactDistrict_${data.contactDistrictId}`);
            await contactDistrictOption.click();
        }

        // Contact Detail Address
        if (data.contactDetailAddress !== undefined && data.contactDetailAddress !== '') {
            const contactDetailAddressInput = await $('~contactDetailAddressInput');
            await contactDetailAddressInput.setValue(data.contactDetailAddress);
        }

        // Description (RichEditor)
        if (data.description !== undefined && data.description !== '') {
            const descriptionEditor = await $('~descriptionEditor');
            await descriptionEditor.setValue(data.description);
        }

        // Scroll to submit if needed
        const submitBtn = await $('~submitJobButton');
        // if (!(await submitBtn.isDisplayed())) {
        //     await fastScrollDown();
        // }

        await submitBtn.click();
    }

    async function newScroll() {
        await driver.execute('mobile: scroll', { direction: 'down' });
    }
    async function fastScrollDown() {
        await driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: 300, y: 900 },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 100 },
                { type: 'pointerMove', duration: 500, x: 300, y: 300 },
                { type: 'pointerUp', button: 0 }
            ]
        }]);
    }

});

