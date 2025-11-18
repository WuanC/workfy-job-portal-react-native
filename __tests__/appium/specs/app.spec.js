const { expect } = require('chai');

describe('Login Functionality', () => {
    before(async () => {
        const emailInput = await $('~emailInput');
        await emailInput.waitForDisplayed({ timeout: 10000 });
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
        await login('', 'validpassword');
    });


    it('1.2 Login with empty password', async () => {
        await login('test@example.com', '');
    });

    it('1.3 Login with invalid email format', async () => {
        await login('invalidemail', 'validpassword');
    });

    it('1.4 Login with incorrect password format (< 8 char)', async () => {
        await login('test@example.com', 'Aa1@');
    });
    it('1.5 Login with incorrect password format (no special char)', async () => {
        await login('test@example.com', 'Aa12345678');
    });
    it('1.6 Login with incorrect password format (no uppercase)', async () => {
        await login('test@example.com', 'aa12345678@');
    });
    it('1.7 Login with incorrect password format (no number)', async () => {
        await login('test@example.com', 'Aaabcdefg@');
    });
    it('1.8 Login with incorrect password', async () => {
        await login('employer@example.com', 'Admin@123');
    });
    it('1.9 Login with valid credentials', async () => {
        await login('employer@example.com', 'Employer@123');
        const homeScreen = await $('~homeScreen');
        expect(await homeScreen.isDisplayed()).to.be.true;
        const settingBtn = await $('~settingsTab');
        await settingBtn.waitForDisplayed({ timeout: 5000 });
        await settingBtn.click();
    });
    // ======================
    // Helper function
    // ======================
    async function login(email, password) {
        const emailInput = await $('~emailInput');
        await emailInput.waitForDisplayed({ timeout: 5000 });
        await emailInput.setValue(email);

        const passwordInput = await $('~passwordInput');
        await passwordInput.waitForDisplayed({ timeout: 5000 });
        await passwordInput.setValue(password);

        const loginBtn = await $('~loginBtn');
        if (await loginBtn.isEnabled()) {
            await loginBtn.click();
        }
    }
});

describe('Change Password Functionality', () => {
    // Giả sử app đã mở sẵn màn hình Settings
    before(async () => {
        const firstInput = await $('~currentPasswordInput');
        await firstInput.waitForDisplayed({ timeout: 10000 });
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
        await changePassword('', 'newpassword123', 'newpassword123');
    });

    it('2.2 Change password with empty new password', async () => {
        await changePassword('oldpassword123', '', 'newpassword123');
    });

    it('2.3 Change password with empty confirm password', async () => {
        await changePassword('oldpassword123', 'newpassword123', '');
    });

    it('2.4 Change password with new password and confirm password mismatch', async () => {
        await changePassword('oldpassword123', 'newpassword123', 'different123');
    });

    it('2.5 Change password with incorrect password format ( < 8 char)', async () => {
        await changePassword('oldpassword123', 'Aa1@', 'Aa1@');
    });
    it('2.6 Change password with incorrect password format (no special char)', async () => {
        await changePassword('Aa12345678', 'Aa12345678', 'Aa12345678');
    });
    it('2.7 Change password with incorrect password format (no uppercase)', async () => {
        await changePassword('oldpassword123', 'aa12345678@', 'aa12345678@');
    });
    it('2.8 Change password with incorrect password format (no number)', async () => {
        await changePassword('Aaaaaaaaaa@', 'Aaaaaaaaaa@', 'Aaaaaaaaaa@');
    });
    it('2.9 Change password with incorrect current password', async () => {
        await changePassword('Employer@1123', 'Employer@123', 'Employer@123');
    });
    it('2.10 Change password successfully', async () => {
        await changePassword('Employer@123', 'Employer@123', 'Employer@123');
        const settingBtn = await $('~jobTab');
        await settingBtn.waitForDisplayed({ timeout: 5000 });
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
        await currentInput.waitForDisplayed({ timeout: 5000 });
        await currentInput.setValue(current);

        const newInput = await $('~newPasswordInput');
        await newInput.waitForDisplayed({ timeout: 5000 });
        await newInput.setValue(newPwd);

        const confirmInput = await $('~confirmPasswordInput');
        await confirmInput.waitForDisplayed({ timeout: 5000 });
        await confirmInput.setValue(confirm);

        const changeBtn = await $('~changePasswordBtn');

        // Scroll nếu button không hiển thị
        if (!(await changeBtn.isDisplayed())) {
            await driver.execute('mobile: scrollGesture', {
                left: 100,
                top: 500,
                width: 300,
                height: 800,
                direction: 'down',
                percent: 0.8
            });
        }

        await changeBtn.click();
    }
});
describe('Post Job', () => {
    before(async () => {
        const companyNameInput = await $('~companyNameInput');
        await companyNameInput.waitForDisplayed({ timeout: 10000 });
    });


    // ========== FILL SEQUENTIAL TESTS (Top to Bottom) ==========
    it('3.1 Empty company name', async () => {
        const companyNameInput = await $('~companyNameInput');
        await companyNameInput.waitForDisplayed({ timeout: 5000 });
        await companyNameInput.clearValue();

        await postJob({ companyName: '' });
    });


    it('3.2 Empty about company', async () => {
        const companyNameInput = await $('~companyNameInput');
        await companyNameInput.setValue('NPT Software');
        await postJob({ aboutCompany: '' });
    });
    it('3.3 Emty job title', async () => {
        await postJob({ aboutCompany: 'About Company' });
    });

    it('3.4 Empty job province', async () => {
        await scrollDown();
        await scrollDown();
        await postJob({ jobTitle: 'Senior Developer' });
    });

    it('3.5 Empty job district', async () => {
        await postJob({ jobProvinceId: 57 });
    });

    it('3.6 Empty job detail address', async () => {
        await postJob({ jobDistrictId: 624 });
    });

    it('3.7 Empty salary type', async () => {
        await postJob({ jobDetailAddress: '123 Main Street' });
    });

    it('3.8 Empty min, max salary', async () => {
        await scrollDown();
        await scrollDown();
        await postJob({ salaryType: 'RANGE' });
    });

    it('3.9 Min salary not greater max salary', async () => {
        await postJob({ minSalary: 1000, maxSalary: 20, salaryUnit: "VND" });
    });
    it('3.10 Min salary and max salary is not negative number', async () => {
        await postJob({ minSalary: -20, maxSalary: 1000, salaryUnit: "VND" });
    });
    it('3.11 Empty job description', async () => {
        await postJob({ minSalary: 20, maxSalary: 1000, salaryUnit: "VND" });
    });


    it('3.12 Empty job requirement', async () => {
        await postJob({ jobDescription: 'Develop and maintain software applications' });
    });

    it('3.13 Empty benefits', async () => {
        await postJob({ requirement: 'Bachelor degree in Computer Science' });
    });

    it('3.14 Empty benefits description', async () => {

        await scrollDown();
        await scrollDown();
        await postJob({ benefits: ['TRAVEL_OPPORTUNITY', 'BONUS_GIFT'] });
    });

    it('3.14 Empty edutcation', async () => {
        await postJob({ benefits: ['TRAVEL_OPPORTUNITY', 'BONUS_GIFT'], benefit1: "Travel", benefit2: "Gift" });
    });

    it('3.15 Empty experience', async () => {

        await scrollDown();
        await scrollDown();
        await postJob({ education: 'HIGH_SCHOOL' });
    });

    it('3.16 Empty job level', async () => {
        await postJob({ experience: 'LESS_THAN_ONE_YEAR' });
    });
    it('3.18 Empty job type', async () => {
        await postJob({ jobLevel: 'INTERN' });
    });
    it('3.19 Empty gender', async () => {
        await postJob({ jobType: 'FULL_TIME' });
    });
    it('3.20 Empty industries', async () => {
        await scrollDown();
        await postJob({ gender: 'MALE' });
    });
    it('3.21 Empty age type', async () => {
        await scrollDown();
        await postJob({ industries: [1] });
    });

    it('3.22 Min age and max age are not filled', async () => {
        await postJob({ ageType: 'INPUT' });
    });
    it('3.23 Min age is not greater than max age', async () => {
        await postJob({ minAge: 30, maxAge: 20 });
    });
    it('3.24 Min age and max age is not negative number', async () => {
        await postJob({ minAge: -20, maxAge: 30 });
    });
    it('3.25 Empty contact name', async () => {
        await postJob({ minAge: 20, maxAge: 30 });
    });
    it('3.26 Empty contact phone', async () => {
        await scrollDown();
        await postJob({ contactName: 'Minh Quan' });
    });
    it('3.27 Contact phone is not phone number', async () => {
        await scrollDown();
        await postJob({ contactPhone: ';12345' });
    });
    it('3.28 Empty contact province', async () => {
        await scrollDown();
        await postJob({ contactPhone: '0944928064' });
    });
    it('3.29 Empty contact district', async () => {
        await scrollDown();
        await scrollDown();
        await scrollDown();
        await scrollDown();
        await postJob({ contactProvinceId: 57 });
    });
    it('3.30 Empty contact detail address', async () => {
        await postJob({ contactDistrictId: 624 });
    });
    it('3.31 Empty contact description', async () => {
        await postJob({ contactDetailAddress: '303 Nguyen Luong bang' });
    });
    it('3.32 Post success', async () => {
        await postJob({ description: 'Description' });
    });
    // ======================
    // Helper function
    // ======================
    async function postJob(data) {
        // Company Name
        if (data.companyName !== undefined && data.companyName !== '') {
            const companyNameInput = await $('~companyNameInput');
            await companyNameInput.waitForDisplayed({ timeout: 5000 });
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
            && data.benefit1 !== undefined && data.benefi1 !== ''
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
            await contactProvinceDropdown.click();
            const contactProvinceOption = await $(`~contactProvince_${data.contactProvinceId}`);
            await contactProvinceOption.click();
        }

        // Contact District
        if (data.contactDistrictId) {
            const contactDistrictDropdown = await $('~contactDistrictDropdown');
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
        //     await scrollDown();
        // }

        await submitBtn.click();
    }

    async function scrollDown() {
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

