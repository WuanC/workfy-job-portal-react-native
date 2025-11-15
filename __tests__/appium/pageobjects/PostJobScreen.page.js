const TestHelper = require('../helpers/TestHelper');

/**
 * Page Object cho PostJobScreen
 * Chứa tất cả các selectors và methods để tương tác với màn hình đăng tin tuyển dụng
 */
class PostJobScreen {
  /**
   * Selectors cho các elements trong form
   */
  get headerTitle() {
    return $('android=new UiSelector().text("Đăng tin tuyển dụng")');
  }

  get backButton() {
    return $('~arrow-back');
  }

  // ========== THÔNG TIN CÔNG TY ==========
  get companyNameInput() {
    return $('android=new UiSelector().text("Tên công ty").fromParent(new UiSelector().className("android.widget.EditText"))');
  }

  get companySizeDropdown() {
    return $('android=new UiSelector().text("Chọn số nhân viên")');
  }

  get companyWebsiteInput() {
    return $('android=new UiSelector().text("Website công ty").fromParent(new UiSelector().className("android.widget.EditText"))');
  }

  // ========== THÔNG TIN CÔNG VIỆC ==========
  get jobTitleInput() {
    return $('android=new UiSelector().text("Tên công việc").fromParent(new UiSelector().className("android.widget.EditText"))');
  }

  get provinceDropdown() {
    return $('android=new UiSelector().text("Chọn Tỉnh / Thành phố")');
  }

  get districtDropdown() {
    return $('android=new UiSelector().text("Chọn Quận / Huyện")');
  }

  get detailAddressInput() {
    return $('android=new UiSelector().descriptionContains("123 Nguyễn Trãi")');
  }

  get salaryTypeDropdown() {
    return $('android=new UiSelector().text("Chọn mức lương")');
  }

  get minSalaryInput() {
    return $('android=new UiSelector().text("Nhập mức lương tối thiểu")');
  }

  get maxSalaryInput() {
    return $('android=new UiSelector().text("Max")');
  }

  get salaryUnitDropdown() {
    return $('android=new UiSelector().text("Đơn vị")');
  }

  get benefitsDropdown() {
    return $('android=new UiSelector().text("Chọn phúc lợi")');
  }

  // ========== CHI TIẾT CÔNG VIỆC ==========
  get educationDropdown() {
    return $('android=new UiSelector().text("Chọn trình độ học vấn")');
  }

  get experienceDropdown() {
    return $('android=new UiSelector().text("Chọn kinh nghiệm làm việc")');
  }

  get jobLevelDropdown() {
    return $('android=new UiSelector().text("Chọn cấp bậc")');
  }

  get jobTypeDropdown() {
    return $('android=new UiSelector().text("Chọn loại công việc")');
  }

  get genderDropdown() {
    return $('android=new UiSelector().text("Chọn giới tính")');
  }

  get jobCodeInput() {
    return $('android=new UiSelector().descriptionContains("RN-2025")');
  }

  get industryDropdown() {
    return $('android=new UiSelector().text("Vui lòng chọn")');
  }

  get ageTypeDropdown() {
    return $('android=new UiSelector().text("Chọn điều kiện độ tuổi")');
  }

  // ========== THÔNG TIN LIÊN HỆ ==========
  get contactNameInput() {
    return $('android=new UiSelector().text("Người liên hệ").fromParent(new UiSelector().className("android.widget.EditText"))');
  }

  get contactPhoneInput() {
    return $('android=new UiSelector().text("Điện thoại liên lạc").fromParent(new UiSelector().className("android.widget.EditText"))');
  }

  get contactProvinceDropdown() {
    return $('android=new UiSelector().text("Chọn Tỉnh / Thành phố").instance(1)');
  }

  get contactDistrictDropdown() {
    return $('android=new UiSelector().text("Chọn Quận / Huyện").instance(1)');
  }

  // ========== BUTTONS ==========
  get submitButton() {
    return $('android=new UiSelector().text("Đăng công việc")');
  }

  /**
   * Methods để tương tác với form
   */

  /**
   * Điền thông tin công ty
   */
  async fillCompanyInfo(data) {
    if (data.companyName) {
      await TestHelper.setValueWithScroll(
        'android=new UiSelector().text("VD: NPT Software")',
        data.companyName
      );
    }

    if (data.companySize) {
      await TestHelper.selectDropdownOption(
        'android=new UiSelector().text("Chọn số nhân viên")',
        data.companySize
      );
    }

    if (data.companyWebsite) {
      await TestHelper.setValueWithScroll(
        'android=new UiSelector().text("VD: https://nptsoftware.vn")',
        data.companyWebsite
      );
    }
  }

  /**
   * Điền thông tin công việc cơ bản
   */
  async fillJobBasicInfo(data) {
    if (data.jobTitle) {
      await TestHelper.setValueWithScroll(
        'android=new UiSelector().text("VD: Lập trình viên React Native")',
        data.jobTitle
      );
    }

    if (data.province) {
      await TestHelper.selectDropdownOption(
        'android=new UiSelector().text("Chọn Tỉnh / Thành phố")',
        data.province
      );
      await driver.pause(1000); // Đợi load districts
    }

    if (data.district) {
      await TestHelper.selectDropdownOption(
        'android=new UiSelector().text("Chọn Quận / Huyện")',
        data.district
      );
    }

    if (data.detailAddress) {
      await TestHelper.setValueWithScroll(
        'android=new UiSelector().text("VD: 123 Nguyễn Trãi, Phường 5")',
        data.detailAddress
      );
    }
  }

  /**
   * Điền thông tin lương
   */
  async fillSalaryInfo(data) {
    if (data.salaryType) {
      await TestHelper.selectDropdownOption(
        'android=new UiSelector().text("Chọn mức lương")',
        data.salaryType
      );
      await driver.pause(500);
    }

    if (data.minSalary) {
      await TestHelper.setValueWithScroll(
        'android=new UiSelector().text("Nhập mức lương tối thiểu")',
        data.minSalary.toString()
      );
    }

    if (data.maxSalary) {
      await TestHelper.setValueWithScroll(
        'android=new UiSelector().text("Max")',
        data.maxSalary.toString()
      );
    }

    if (data.salaryUnit) {
      await TestHelper.selectDropdownOption(
        'android=new UiSelector().text("Đơn vị")',
        data.salaryUnit
      );
    }
  }

  /**
   * Chọn phúc lợi
   */
  async selectBenefits(benefits) {
    await TestHelper.clickWithScroll('android=new UiSelector().text("Chọn phúc lợi")');
    await driver.pause(1000);

    for (const benefit of benefits) {
      const benefitSelector = `android=new UiSelector().textContains("${benefit}")`;
      await TestHelper.clickWithScroll(benefitSelector);
      await driver.pause(300);
    }

    // Đóng dropdown
    await driver.back();
    await driver.pause(500);
  }

  /**
   * Điền chi tiết công việc
   */
  async fillJobDetails(data) {
    if (data.education) {
      await TestHelper.selectDropdownOption(
        'android=new UiSelector().text("Chọn trình độ học vấn")',
        data.education
      );
    }

    if (data.experience) {
      await TestHelper.selectDropdownOption(
        'android=new UiSelector().text("Chọn kinh nghiệm làm việc")',
        data.experience
      );
    }

    if (data.jobLevel) {
      await TestHelper.selectDropdownOption(
        'android=new UiSelector().text("Chọn cấp bậc")',
        data.jobLevel
      );
    }

    if (data.jobType) {
      await TestHelper.selectDropdownOption(
        'android=new UiSelector().text("Chọn loại công việc")',
        data.jobType
      );
    }

    if (data.gender) {
      await TestHelper.selectDropdownOption(
        'android=new UiSelector().text("Chọn giới tính")',
        data.gender
      );
    }

    if (data.industry) {
      await TestHelper.selectDropdownOption(
        'android=new UiSelector().text("Vui lòng chọn")',
        data.industry
      );
    }

    if (data.ageType) {
      await TestHelper.selectDropdownOption(
        'android=new UiSelector().text("Chọn điều kiện độ tuổi")',
        data.ageType
      );
    }
  }

  /**
   * Điền thông tin liên hệ
   */
  async fillContactInfo(data) {
    if (data.contactName) {
      await TestHelper.setValueWithScroll(
        'android=new UiSelector().text("VD: Lê Hữu Nam")',
        data.contactName
      );
    }

    if (data.contactPhone) {
      await TestHelper.setValueWithScroll(
        'android=new UiSelector().text("VD: 0905 123 456")',
        data.contactPhone
      );
    }

    if (data.contactProvince) {
      // Tìm dropdown tỉnh thứ 2 (cho contact)
      const provinces = await $$('android=new UiSelector().text("Chọn Tỉnh / Thành phố")');
      if (provinces.length > 1) {
        await provinces[1].click();
        await driver.pause(1000);
        const option = await $(`android=new UiSelector().textContains("${data.contactProvince}")`);
        await option.click();
      }
    }

    if (data.contactDistrict) {
      const districts = await $$('android=new UiSelector().text("Chọn Quận / Huyện")');
      if (districts.length > 1) {
        await districts[1].click();
        await driver.pause(1000);
        const option = await $(`android=new UiSelector().textContains("${data.contactDistrict}")`);
        await option.click();
      }
    }
  }

  /**
   * Click nút submit
   */
  async clickSubmit() {
    await TestHelper.clickWithScroll('android=new UiSelector().text("Đăng công việc")');
  }

  /**
   * Verify màn hình đã load
   */
  async waitForScreenLoad() {
    await this.headerTitle.waitForDisplayed({ timeout: 10000 });
  }

  /**
   * Verify success toast
   */
  async verifySuccessToast() {
    await TestHelper.waitForToast('Thành công', 5000);
  }

  /**
   * Verify error toast
   */
  async verifyErrorToast(message) {
    await TestHelper.waitForToast(message, 5000);
  }
}

module.exports = new PostJobScreen();
