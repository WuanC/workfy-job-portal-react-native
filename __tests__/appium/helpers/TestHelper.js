/**
 * Helper functions cho Appium tests
 */

class TestHelper {
  /**
   * Scroll xuống để tìm element
   * @param {string} selector - Element selector
   * @param {number} maxScrolls - Số lần scroll tối đa
   */
  async scrollToElement(selector, maxScrolls = 10) {
    for (let i = 0; i < maxScrolls; i++) {
      try {
        const element = await $(selector);
        if (await element.isDisplayed()) {
          return element;
        }
      } catch (error) {
        // Element chưa xuất hiện, tiếp tục scroll
      }
      
      // Scroll down
      await driver.execute('mobile: scrollGesture', {
        left: 100,
        top: 100,
        width: 200,
        height: 200,
        direction: 'down',
        percent: 3.0
      });
      
      await driver.pause(500);
    }
    
    throw new Error(`Element ${selector} not found after ${maxScrolls} scrolls`);
  }

  /**
   * Scroll lên trên cùng của màn hình
   */
  async scrollToTop() {
    for (let i = 0; i < 10; i++) {
      await driver.execute('mobile: scrollGesture', {
        left: 100,
        top: 500,
        width: 200,
        height: 200,
        direction: 'up',
        percent: 3.0
      });
      await driver.pause(300);
    }
  }

  /**
   * Nhập text vào input field với scroll nếu cần
   * @param {string} selector - Element selector
   * @param {string} text - Text cần nhập
   */
  async setValueWithScroll(selector, text) {
    const element = await this.scrollToElement(selector);
    await element.waitForDisplayed({ timeout: 5000 });
    await element.click();
    await element.clearValue();
    await element.setValue(text);
    
    // Hide keyboard sau khi nhập
    try {
      await driver.hideKeyboard();
    } catch (e) {
      // Keyboard có thể đã ẩn
    }
  }

  /**
   * Click vào element với scroll nếu cần
   * @param {string} selector - Element selector
   */
  async clickWithScroll(selector) {
    const element = await this.scrollToElement(selector);
    await element.waitForDisplayed({ timeout: 5000 });
    await element.click();
  }

  /**
   * Chọn giá trị từ Dropdown
   * @param {string} dropdownSelector - Dropdown selector
   * @param {string} optionText - Text của option cần chọn
   */
  async selectDropdownOption(dropdownSelector, optionText) {
    await this.clickWithScroll(dropdownSelector);
    await driver.pause(1000); // Đợi dropdown mở
    
    // Tìm và click vào option
    const optionSelector = `android=new UiSelector().textContains("${optionText}")`;
    const option = await $(optionSelector);
    await option.waitForDisplayed({ timeout: 5000 });
    await option.click();
  }

  /**
   * Đợi toast message xuất hiện
   * @param {string} message - Text của toast
   * @param {number} timeout - Timeout
   */
  async waitForToast(message, timeout = 5000) {
    const toastSelector = `android=new UiSelector().textContains("${message}")`;
    const toast = await $(toastSelector);
    await toast.waitForDisplayed({ timeout });
    return toast;
  }

  /**
   * Take screenshot với tên file
   * @param {string} filename - Tên file
   */
  async takeScreenshot(filename) {
    await driver.saveScreenshot(`./screenshots/${filename}.png`);
  }

  /**
   * Đợi element biến mất
   * @param {string} selector - Element selector
   * @param {number} timeout - Timeout
   */
  async waitForElementToDisappear(selector, timeout = 10000) {
    const element = await $(selector);
    await element.waitForDisplayed({ timeout, reverse: true });
  }

  /**
   * Get text của element
   * @param {string} selector - Element selector
   */
  async getElementText(selector) {
    const element = await this.scrollToElement(selector);
    return await element.getText();
  }

  /**
   * Kiểm tra element có hiển thị không
   * @param {string} selector - Element selector
   */
  async isElementDisplayed(selector) {
    try {
      const element = await $(selector);
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  /**
   * Đợi loading indicator biến mất
   */
  async waitForLoadingComplete() {
    try {
      const loadingSelector = 'android=new UiSelector().className("android.widget.ProgressBar")';
      await this.waitForElementToDisappear(loadingSelector, 10000);
    } catch (error) {
      // Loading có thể không xuất hiện
    }
  }
}

module.exports = new TestHelper();
