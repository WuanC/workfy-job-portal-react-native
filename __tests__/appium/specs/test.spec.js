const { expect } = require('chai');

describe('Post Job Screen', () => {
    before(async () => {
        //await scrollDown();
        const companyNameInput = await $('~companyNameInput');
        await companyNameInput.waitForDisplayed({ timeout: 10000 });
    });

    // beforeEach(async () => {
    //     await scrollToTop();
    //     await driver.pause(1000);
    // });

    // ========== FILL SEQUENTIAL TESTS (Top to Bottom) ==========
    it('Step 1: Fill company name', async () => {
        const companyNameInput = await $('~companyNameInput');
        await companyNameInput.waitForDisplayed({ timeout: 5000 });
        await companyNameInput.clearValue();

        await companyNameInput.setValue('');
        //expect(await companyNameInput.getText()).to.equal('');

        await postJob({ companyName: '' });
    });


    it('Step 4: Fill company info and about company', async () => {
        const companyNameInput = await $('~companyNameInput');
        await companyNameInput.setValue('NPT Software');

        // const companyWebsiteInput = await $('~companyWebsiteInput');
        // await companyWebsiteInput.setValue('https://npt.com');

        const aboutCompanyEditor = await $('~aboutCompanyEditor');
        await aboutCompanyEditor.setValue('');

        //expect(await aboutCompanyEditor.getText()).to.equal('About NPT Software Company');
        await postJob({ aboutCompany: '' });
    });
    it('Step 4: Fill company info and about company', async () => {
        // const companyNameInput = await $('~companyNameInput');
        // await companyNameInput.setValue('NPT Software');

        // const companyWebsiteInput = await $('~companyWebsiteInput');
        // await companyWebsiteInput.setValue('https://npt.com');

        //expect(await aboutCompanyEditor.getText()).to.equal('About NPT Software Company');

        await postJob({ aboutCompany: 'About Company' });
    });

    it('Step 5: Fill company info and job title', async () => {
        await scrollDown();
        await scrollDown();
        //expect(await jobTitleInput.getText()).to.equal('Senior Developer');

        await postJob({ jobTitle: 'Senior Developer' });
    });

    it('Step 6: Fill up to job province', async () => {
        //await scrollDown();
        // const provinceDropdown = await $('~provinceDropdown');
        // await provinceDropdown.click();
        // const provinceOption = await $('~province_1');
        // await provinceOption.click();

        //expect(await provinceDropdown.getText()).to.not.be.empty;
        await postJob({ jobProvinceId: 57 });
    });

    it('Step 7: Fill up to job district', async () => {

        //expect(await districtDropdown.getText()).to.not.be.empty;
        await postJob({ jobDistrictId: 624 });
    });

    it('Step 8: Fill up to job detail address', async () => {

        // expect(await jobDetailAddressInput.getText()).to.equal('123 Main Street');

        await postJob({ jobDetailAddress: '123 Main Street' });
    });

    it('Step 9: Fill up to salary type', async () => {
        await scrollDown();
        await scrollDown();

        //expect(await salaryTypeDropdown.getText()).to.include('RANGE');
        await postJob({ salaryType: 'RANGE' });
    });

    it('Step 9: Fill up to salary type', async () => {
        //expect(await salaryTypeDropdown.getText()).to.include('RANGE');
        await postJob({ minSalary: 1000, maxSalary: 20, salaryUnit: "VND" });
    });
    it('Step 9: Fill up to salary type', async () => {
        //expect(await salaryTypeDropdown.getText()).to.include('RANGE');
        await postJob({ minSalary: -20, maxSalary: 1000, salaryUnit: "VND" });
    });
    it('Step 9: Fill up to salary type', async () => {
        //expect(await salaryTypeDropdown.getText()).to.include('RANGE');
        await postJob({ minSalary: 20, maxSalary: 1000, salaryUnit: "VND" });
    });


    it('Step 12: Fill up to job description', async () => {
        //expect(await jobDescriptionEditor.getText()).to.equal('Develop and maintain software applications');
        await postJob({ jobDescription: 'Develop and maintain software applications' });
    });

    it('Step 13: Fill up to requirement', async () => {

        //expect(await requirementEditor.getText()).to.equal('Bachelor degree in Computer Science');
        await postJob({ requirement: 'Bachelor degree in Computer Science' });
    });

    it('Step 14: Fill up to benefits', async () => {

        await scrollDown();
        await scrollDown();

        //expect(await benefitsMultiSelect.getText()).to.not.be.empty;

        await postJob({ benefits: ['TRAVEL_OPPORTUNITY', 'BONUS_GIFT'] });
    });

    it('Step 14: Fill up to benefits', async () => {
        //expect(await benefitsMultiSelect.getText()).to.not.be.empty;

        await postJob({ benefits: ['TRAVEL_OPPORTUNITY', 'BONUS_GIFT'], benefit1: "Travel", benefit2: "Gift" });
    });

    it('Step 15: Fill up to education', async () => {

        await scrollDown();
        await scrollDown();
        //expect(await educationDropdown.getText()).to.include('BACHELOR');

        await postJob({ education: 'HIGH_SCHOOL' });
    });

    it('Step 16: Fill up to experience', async () => {
        //expect(await experienceDropdown.getText()).to.include('1-3');

        await postJob({ experience: 'LESS_THAN_ONE_YEAR' });
    });
    it('Step 16: Fill up to jobLevel', async () => {
        await postJob({ jobLevel: 'INTERN' });
    });
    it('Step 16: Fill up to jobType', async () => {
        await postJob({ jobType: 'FULL_TIME' });
    });
    it('Step 16: Fill up to Gender', async () => {
        await scrollDown();
        await postJob({ gender: 'MALE' });
    });
    it('Step 16: Fill up to industries', async () => {
        await scrollDown();
        await postJob({ industries: [1] });
    });

    it('Step 16: Fill up to age', async () => {
        await postJob({ ageType: 'INPUT' });
    });
    it('Step 16: Fill up to age', async () => {
        await postJob({ minAge: 30, maxAge: 20 });
    });
    it('Step 16: Fill up to age', async () => {
        await postJob({ minAge: -20, maxAge: 30 });
    });
    it('Step 16: Fill up to age', async () => {
        await postJob({ minAge: 20, maxAge: 30 });
    });
    it('Step 16: Fill up to contact name', async () => {
        await scrollDown();
        await postJob({ contactName: 'Minh Quan' });
    });
    it('Step 16: Fill up to contact phone', async () => {
        await scrollDown();
        await postJob({ contactPhone: ';12345' });
    });
    it('Step 16: Fill up to contact province', async () => {
        await scrollDown();
        await scrollDown();
        await scrollDown();
        await scrollDown();
        await postJob({ contactProvinceId: 57 });
    });
    it('Step 16: Fill up to contact district', async () => {
        await postJob({ contactDistrictId: 624 });
    });
    it('Step 16: Fill up to contact detail address', async () => {
        await postJob({ contactDetailAddress: '303 Nguyen Luong bang' });
    });
    it('Step 16: Fill up to description', async () => {
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