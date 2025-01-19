const puppeteer = require("puppeteer");

const formFields = require("./addresses.json");

(async () => {
  let i = 0;
  while (1) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    if (i == 1999) {
      i = 0;
    }
    // Navigate to the product URL
    await page.goto(
      "https://seedghani.com/products/first-rain-perfume-oil-699-12ml-inspire",
      {
        waitUntil: "networkidle2",
      }
    );
    console.log("Page loaded.");

    // Wait for the popup button and click it
    const popupButtonSelector = ".es-popup-button-product";
    await page.waitForSelector(popupButtonSelector, { timeout: 10000 });
    await page.click(popupButtonSelector);
    console.log("Popup button clicked.");

    // Replace waitForTimeout with setTimeout polyfill
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Adjust delay if needed
    try {
      await page.type('input[name="first_name"]', formFields[i].first_name);
      await page.type('input[name="phone"]', formFields[i].phone);
      await page.type('input[name="address"]', formFields[i].address);
      await page.type('input[name="address2"]', formFields[i].address2);
      await page.type('input[name="zip"]', formFields[i].zip);
      console.log("Form fields filled.");
    } catch (e) {
      console.log(e);
      i = 0;
    }
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Adjust delay if needed
    // Submit the form
    const submitButtonSelector = ".es-button";
    await page.waitForSelector(submitButtonSelector, { timeout: 10000 });
    await page.click(submitButtonSelector);
    console.log("Form submitted.");

    // Optional: Wait for form submission response
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Keep the browser open for 1 minute
    console.log("Keeping the browser open for 30sec...");
    await new Promise((resolve) => setTimeout(resolve, 30000));

    await browser.close();
    console.log("Automation complete. Browser closed.");
    i++;
  }
})();
