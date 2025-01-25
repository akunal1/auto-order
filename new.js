const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");
const path = require("path");
const formFields = require("./updated_addresses.json");

puppeteer.use(StealthPlugin());

function generatePhoneNumber() {
  // Randomly pick a starting digit: 9, 8, or 7
  const startingDigit = [9, 8, 7][Math.floor(Math.random() * 3)];

  // Generate the remaining 9 digits randomly
  const remainingDigits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');

  // Combine starting digit with the remaining digits
  const phoneNumber = `${startingDigit}${remainingDigits}`;
  return phoneNumber;
}

const lastIndexPath = process.env.LAST_INDEX_PATH || "./state/last_index.json";

const loadLastIndex = () => {
  try {
    if (fs.existsSync(lastIndexPath)) {
      const data = fs.readFileSync(lastIndexPath, "utf8");
      return JSON.parse(data).lastIndex || 0;
    }
  } catch (error) {
    console.error("Error loading last index:", error);
  }
  return 0; // Default to 0 if the file doesn't exist
};

// Function to save the current value of `i`
const saveLastIndex = (index) => {
  try {
    fs.writeFileSync(
      lastIndexPath,
      JSON.stringify({ lastIndex: index }, null, 2)
    );
    console.log("Saved last index:", index);
  } catch (error) {
    console.error("Error saving last index:", error);
  }
};

(async () => {
  let i = loadLastIndex();
  let j = 0;

  while (true) {
    console.log(
      "\n********************** order number *********************** ",
      ++i,
      "at : ",
      new Date().toLocaleString()
    );
    if (i >= formFields.length) {
      i = 0; // Reset if we reach the end of the formFields array
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();

      const urls = [
        "https://seedghani.com/products/first-rain-perfume-oil-699-12ml-inspire",
        "https://seedghani.com/products/first-rain-attar-799-12ml",
      ];
      const randomUrl = urls[Math.floor(Math.random() * urls.length)];
      await page.goto(randomUrl, { waitUntil: "networkidle2", timeout: 60000 });
      console.log(`Navigated to ${randomUrl}`);

      // (Rest of your automation logic...)

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

      //   await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds

      // Click on the cart icon
      //   const cartIconId = "#cart-icon-bubble";
      //   await page.waitForSelector(cartIconId, { timeout: 20000 });
      //   await page
      //     .click(cartIconId)
      //     .catch(() => console.log("Cart icon not found"));

      await page.goto("https://seedghani.com/cart", {
        waitUntil: "networkidle2",
        timeout: 60000,
      });

      console.log("Navigated to cart page");
      //   await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds

      // Click on the checkout button
      const checkoutButtonId = "#checkout"; //".cart__checkout-button";
      //   const checkoutButtonExists = await page.$(checkoutButtonId);

      await page.waitForSelector(checkoutButtonId, { timeout: 10000 });

      await page.click(checkoutButtonId);
      console.log("checkoutButtonId button clicked.");
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 15 seconds
      console.log("waited 5 seconds");

      //   const popup_button = "#checkout";
      //   await page.waitForSelector(popup_button, { timeout: 10000 });
      //   await page.click(popup_button);

      //   await new Promise((resolve) => setTimeout(resolve, 5000));

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

      let contact = data.email
       console.log("mobile number generated-->",contact,(data.email??"").lenght===10 )
      if((data.email??"").lenght===10){
          console.log()
          contact =  generatePhoneNumber()
        
      }

      await page.type('input[name="email"]', contact, {
        delay: Math.random() * 200 + 50,
      });
      await page.type('input[name="firstName"]', data.firstName, {
        delay: Math.random() * 200 + 50,
      });
      await page.type('input[name="lastName"]', data.lastName, {
        delay: Math.random() * 200 + 50,
      });
      await page.type('input[name="address1"]', data.address1, {
        delay: Math.random() * 200 + 50,
      });
      await page.type('input[name="address2"]', data.address2, {
        delay: Math.random() * 200 + 50,
      });
      await page.type('input[name="city"]', data.city, {
        delay: Math.random() * 200 + 50,
      });
      await page.select('select[name="zone"]', data.zone);
      await page.type('input[name="postalCode"]', data.postalCode.toString(), {
        delay: Math.random() * 200 + 50,
      });

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
      console.log("contact info:", contact);

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
      saveLastIndex(i); // Save the current value of `i`
      await browser.close();
      console.log("Browser closed. Restarting process...");
      if(j>35){
          break;
      }
    
    }
  }
})();
