const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const formFields = require("./updated_addresses.json");

puppeteer.use(StealthPlugin());

(async () => {
  let i = 0;
  let j = -1
  while (true) {
    console.log(
      "\n********************** order number *********************** ",
      ++j
    );
    if (i > 5999) {
      i = 0;
    }
    const browser = await puppeteer.launch({
      headless: true, // Set to true for CI
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      //   devtools: true,
    });

    try {
      const page = await browser.newPage();

      // Choose a random URL
      const urls = [
        "https://seedghani.com/products/first-rain-perfume-oil-699-12ml-inspire",
        "https://seedghani.com/products/first-rain-attar-799-12ml",
      ];
      const randomUrl = urls[Math.floor(Math.random() * urls.length)];
      await page.goto(randomUrl, { waitUntil: "networkidle2", timeout: 60000 });
      console.log(`Navigated to ${randomUrl}`);

      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 10 seconds

      // Click on the popup button
      //   const popupButtonId = "#es-popup-button";
      //   await page.waitForSelector(popupButtonId, { timeout: 10000 });
      //   await page
      //     .click(popupButtonId)
      //     .catch(() => console.log("Popup button not found"));

      const popupButtonSelector = ".es-popup-button-product";
      await page.waitForSelector(popupButtonSelector, { timeout: 10000 });
      await page.click(popupButtonSelector);
      console.log("Popup button clicked.");

      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds

      // Refresh the page
      await page.reload({ waitUntil: "networkidle2" });
      console.log("Page refreshed.");

      await new Promise((resolve) => setTimeout(resolve, 15000)); // Wait 10 seconds

      // Click on the cart icon
      const cartIconId = "#cart-icon-bubble";
      await page.waitForSelector(cartIconId, { timeout: 20000 });
      await page
        .click(cartIconId)
        .catch(() => console.log("Cart icon not found"));

      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds

      // Click on the checkout button
      const checkoutButtonId = ".cart__checkout-button";
      //   const checkoutButtonExists = await page.$(checkoutButtonId);

      await page.waitForSelector(checkoutButtonId, { timeout: 10000 });

      await page.click(checkoutButtonId);
      console.log("checkoutButtonId button clicked.");

      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 15 seconds
      console.log("waited 5 seconds");

      const popup_button = "#checkout";
      await page.waitForSelector(popup_button, { timeout: 10000 });
      await page.click(popup_button);

      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Fill the form fields
      //   const i = Math.floor(Math.random() * formFields.length);
      const data = formFields[i];

      const typeLikeHuman = async (selector, text) => {
        for (const char of text) {
          await page.type(selector, char, { delay: Math.random() * 100 + 50 });
        }
      };

      await page.waitForSelector('input[name="email"]', {
        visible: true,
        timeout: 10000,
      });

      await page.type('input[name="email"]', data.email);
      await page.type('input[name="firstName"]', data.firstName);
      await page.type('input[name="lastName"]', data.lastName);
      await page.type('input[name="address1"]', data.address1);
      await page.type('input[name="address2"]', data.address2);
      await page.type('input[name="city"]', data.city);
      await page.select('select[name="zone"]', data.zone);
      await page.type('input[name="postalCode"]', data.postalCode.toString());

      //   await typeLikeHuman('input[name="email"]', data.email);
      //   await typeLikeHuman('input[name="firstName"]', data.firstName);
      //   await typeLikeHuman('input[name="lastName"]', data.lastName);
      //   await typeLikeHuman('input[name="address1"]', data.address1);
      //   if (data.address2) {
      //     await typeLikeHuman('input[name="address2"]', data.address2);
      //   }
      //   await typeLikeHuman('input[name="city"]', data.city);
      //   await page.select('select[name="zone"]', data.zone);
      //   await typeLikeHuman(
      //     'input[name="postalCode"]',
      //     data.postalCode.toString()
      //   );

      console.log("Form filled with data:", data);

      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 10 seconds

      // Click on the pay button
      const payButtonId = "#checkout-pay-button";
      await page
        .click(payButtonId)
        .catch(() => console.log("Pay button not found"));

      await new Promise((resolve) => setTimeout(resolve, 20000)); // Wait 30 seconds
    } catch (error) {
      console.error("Error during automation:", error);
    } finally {
      i++;
      await browser.close();
      console.log("Browser closed. Restarting process...");
    }
  }
})();
