const puppeteer = require("puppeteer");

const formFields = require("./addresses.json");

(async () => {
  while (1) {
    // Assign a random number to i for each iteration
    const i = Math.floor(Math.random() * 2000);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true, // Use headless mode in CI environments
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Disable the sandbox
    });
    const page = await browser.newPage();

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

    // Wait for the form to appear
    await new Promise((resolve) => setTimeout(resolve, 5000));

    try {
      // Fill the form fields
      await page.type('input[name="first_name"]', formFields[i].first_name);
      await page.type('input[name="phone"]', formFields[i].phone);
      await page.type('input[name="address"]', formFields[i].address);
      await page.type('input[name="address2"]', formFields[i].address2);
      await page.type('input[name="zip"]', formFields[i].zip);
      console.log("Form fields filled.");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (e) {
      console.error("Error filling form fields:", e);
      await browser.close();
      continue; // Skip this iteration and restart
    }

    // Wait for the submit button and click it
    const submitButtonSelector = ".es-button";
    await page.waitForSelector(submitButtonSelector, { timeout: 10000 });

    let newUrl;
    try {
      const [response] = await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle2" }), // Wait for the URL to change
        page.click(submitButtonSelector), // Click the submit button
      ]);
      console.log("Form submitted.");

      // Log the new URL
      newUrl = page.url();
      console.log("New URL:", newUrl);
    } catch (error) {
      console.error("Error detecting URL change:", error);
      newUrl = null;
    }

    // Check if new URL is null
    if (!newUrl) {
      console.log("URL is null or an error occurred. Sleeping for 13 hours...");
      await new Promise((resolve) => setTimeout(resolve, 13 * 60 * 60 * 1000)); // Sleep for 13 hours
    }

    // Optional: Wait after form submission
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Keep the browser open for 30 seconds
    console.log("Keeping the browser open for 30sec...");
    await new Promise((resolve) => setTimeout(resolve, 30000));

    await browser.close();
    console.log("Automation complete. Browser closed.");
  }
})();
