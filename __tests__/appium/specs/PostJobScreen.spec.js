const PostJobScreen = require('../pageobjects/PostJobScreen.page');
const TestHelper = require('../helpers/TestHelper');

describe('PostJobScreen - Tạo công việc mới', () => {
  
  beforeEach(async () => {
    // Đảm bảo màn hình PostJobScreen đã load
    await PostJobScreen.waitForScreenLoad();
    await TestHelper.scrollToTop();
    await driver.pause(1000);
  });

  /**
   * Test Case 1: Kiểm tra validation - Không nhập tên công ty
   */
  it('TC01 - Hiển thị lỗi khi không nhập tên công ty', async () => {
    // Scroll xuống và click submit ngay
    await PostJobScreen.clickSubmit();
    
    // Verify error toast xuất hiện
    await PostJobScreen.verifyErrorToast('Vui lòng nhập tên công ty');
  });

  /**
   * Test Case 2: Kiểm tra validation - Không chọn quy mô công ty
   */
  it('TC02 - Hiển thị lỗi khi không chọn quy mô công ty', async () => {
    await PostJobScreen.fillCompanyInfo({
      companyName: 'Test Company'
    });
    
    await PostJobScreen.clickSubmit();
    await PostJobScreen.verifyErrorToast('Vui lòng chọn quy mô công ty');
  });

  /**
   * Test Case 3: Kiểm tra validation - Không nhập tên công việc
   */
  it('TC03 - Hiển thị lỗi khi không nhập tên công việc', async () => {
    await PostJobScreen.fillCompanyInfo({
      companyName: 'Test Company',
      companySize: '50-100'
    });
    
    await PostJobScreen.clickSubmit();
    await PostJobScreen.verifyErrorToast('Vui lòng nhập tên công việc');
  });

  /**
   * Test Case 4: Kiểm tra validation - Số điện thoại không hợp lệ
   */
  it('TC04 - Hiển thị lỗi khi số điện thoại không hợp lệ', async () => {
    // Điền đầy đủ thông tin nhưng số điện thoại sai format
    await PostJobScreen.fillCompanyInfo({
      companyName: 'Test Company',
      companySize: '50-100'
    });

    await PostJobScreen.fillJobBasicInfo({
      jobTitle: 'React Native Developer',
      province: 'Hồ Chí Minh',
      district: 'Quận 1'
    });

    await PostJobScreen.fillSalaryInfo({
      salaryType: 'Thỏa thuận'
    });

    await PostJobScreen.selectBenefits(['Bảo hiểm']);

    await PostJobScreen.fillJobDetails({
      education: 'Đại học',
      experience: '1-2 năm',
      jobLevel: 'Nhân viên',
      jobType: 'Toàn thời gian',
      gender: 'Không yêu cầu',
      industry: 'IT',
      ageType: 'Không yêu cầu'
    });

    await PostJobScreen.fillContactInfo({
      contactName: 'Nguyen Van A',
      contactPhone: '123', // Số điện thoại không hợp lệ
      contactProvince: 'Hồ Chí Minh',
      contactDistrict: 'Quận 1'
    });

    await PostJobScreen.clickSubmit();
    await PostJobScreen.verifyErrorToast('Sai định dạng');
  });

  /**
   * Test Case 5: Kiểm tra validation - Lương tối thiểu >= lương tối đa
   */
  it('TC05 - Hiển thị lỗi khi mức lương không hợp lệ (Min >= Max)', async () => {
    await PostJobScreen.fillCompanyInfo({
      companyName: 'Test Company',
      companySize: '50-100'
    });

    await PostJobScreen.fillJobBasicInfo({
      jobTitle: 'React Native Developer',
      province: 'Hồ Chí Minh',
      district: 'Quận 1'
    });

    await PostJobScreen.fillSalaryInfo({
      salaryType: 'Trong khoảng',
      minSalary: 2000,
      maxSalary: 1000, // Max < Min
      salaryUnit: 'USD'
    });

    await PostJobScreen.clickSubmit();
    await PostJobScreen.verifyErrorToast('Vui lòng nhập mức lương hợp lệ');
  });

  /**
   * Test Case 6: Tạo job thành công với thông tin đầy đủ - Lương "Trên"
   */
  it('TC06 - Tạo job thành công với lương "Trên"', async () => {
    // Điền thông tin công ty
    await PostJobScreen.fillCompanyInfo({
      companyName: 'NPT Software',
      companySize: '100-200',
      companyWebsite: 'https://nptsoftware.vn'
    });

    // Điền thông tin công việc
    await PostJobScreen.fillJobBasicInfo({
      jobTitle: 'Senior React Native Developer',
      province: 'Hà Nội',
      district: 'Ba Đình',
      detailAddress: '123 Láng Hạ'
    });

    // Điền thông tin lương
    await PostJobScreen.fillSalaryInfo({
      salaryType: 'Trên',
      minSalary: 1500,
      salaryUnit: 'USD'
    });

    // Chọn phúc lợi
    await PostJobScreen.selectBenefits([
      'Bảo hiểm y tế',
      'Thưởng'
    ]);

    // Điền chi tiết công việc
    await PostJobScreen.fillJobDetails({
      education: 'Đại học',
      experience: '3-5 năm',
      jobLevel: 'Trưởng nhóm',
      jobType: 'Toàn thời gian',
      gender: 'Nam',
      industry: 'Công nghệ thông tin',
      ageType: 'Trong khoảng'
    });

    // Điền thông tin liên hệ
    await PostJobScreen.fillContactInfo({
      contactName: 'Lê Hữu Nam',
      contactPhone: '0905123456',
      contactProvince: 'Hà Nội',
      contactDistrict: 'Ba Đình'
    });

    // Submit
    await PostJobScreen.clickSubmit();

    // Verify thành công
    await PostJobScreen.verifySuccessToast();
    
    // Take screenshot
    await TestHelper.takeScreenshot('TC06_create_job_success');
  });

  /**
   * Test Case 7: Tạo job thành công với lương "Trong khoảng"
   */
  it('TC07 - Tạo job thành công với lương "Trong khoảng"', async () => {
    await PostJobScreen.fillCompanyInfo({
      companyName: 'ABC Company',
      companySize: '50-100'
    });

    await PostJobScreen.fillJobBasicInfo({
      jobTitle: 'Junior React Native Developer',
      province: 'Hồ Chí Minh',
      district: 'Quận 1',
      detailAddress: '456 Nguyễn Huệ'
    });

    await PostJobScreen.fillSalaryInfo({
      salaryType: 'Trong khoảng',
      minSalary: 500,
      maxSalary: 1000,
      salaryUnit: 'USD'
    });

    await PostJobScreen.selectBenefits(['Bảo hiểm']);

    await PostJobScreen.fillJobDetails({
      education: 'Cao đẳng',
      experience: 'Dưới 1 năm',
      jobLevel: 'Nhân viên',
      jobType: 'Toàn thời gian',
      gender: 'Không yêu cầu',
      industry: 'Công nghệ thông tin',
      ageType: 'Không yêu cầu'
    });

    await PostJobScreen.fillContactInfo({
      contactName: 'Trần Văn B',
      contactPhone: '0912345678',
      contactProvince: 'Hồ Chí Minh',
      contactDistrict: 'Quận 1'
    });

    await PostJobScreen.clickSubmit();
    await PostJobScreen.verifySuccessToast();
    
    await TestHelper.takeScreenshot('TC07_create_job_with_range_salary');
  });

  /**
   * Test Case 8: Tạo job thành công với lương "Thỏa thuận"
   */
  it('TC08 - Tạo job thành công với lương "Thỏa thuận"', async () => {
    await PostJobScreen.fillCompanyInfo({
      companyName: 'XYZ Corporation',
      companySize: '200-500'
    });

    await PostJobScreen.fillJobBasicInfo({
      jobTitle: 'React Native Tech Lead',
      province: 'Đà Nẵng',
      district: 'Hải Châu',
      detailAddress: '789 Trần Phú'
    });

    await PostJobScreen.fillSalaryInfo({
      salaryType: 'Thỏa thuận'
    });

    await PostJobScreen.selectBenefits([
      'Bảo hiểm',
      'Thưởng',
      'Đào tạo'
    ]);

    await PostJobScreen.fillJobDetails({
      education: 'Đại học',
      experience: 'Trên 5 năm',
      jobLevel: 'Quản lý',
      jobType: 'Toàn thời gian',
      gender: 'Không yêu cầu',
      industry: 'Công nghệ thông tin',
      ageType: 'Trên'
    });

    await PostJobScreen.fillContactInfo({
      contactName: 'Phạm Thị C',
      contactPhone: '0987654321',
      contactProvince: 'Đà Nẵng',
      contactDistrict: 'Hải Châu'
    });

    await PostJobScreen.clickSubmit();
    await PostJobScreen.verifySuccessToast();
    
    await TestHelper.takeScreenshot('TC08_create_job_negotiable_salary');
  });

  /**
   * Test Case 9: Kiểm tra validation - Không chọn phúc lợi
   */
  it('TC09 - Hiển thị lỗi khi không chọn phúc lợi', async () => {
    await PostJobScreen.fillCompanyInfo({
      companyName: 'Test Company',
      companySize: '50-100'
    });

    await PostJobScreen.fillJobBasicInfo({
      jobTitle: 'React Native Developer',
      province: 'Hồ Chí Minh',
      district: 'Quận 1'
    });

    await PostJobScreen.fillSalaryInfo({
      salaryType: 'Thỏa thuận'
    });

    // Không chọn phúc lợi

    await PostJobScreen.clickSubmit();
    await PostJobScreen.verifyErrorToast('Phúc lợi không được để trống');
  });

  /**
   * Test Case 10: Kiểm tra chức năng Back
   */
  it('TC10 - Quay lại màn hình trước khi click nút Back', async () => {
    await PostJobScreen.backButton.click();
    await driver.pause(1000);
    
    // Verify đã quay lại (header không còn hiển thị)
    const isDisplayed = await TestHelper.isElementDisplayed(
      'android=new UiSelector().text("Đăng tin tuyển dụng")'
    );
    
    expect(isDisplayed).toBe(false);
  });
});
