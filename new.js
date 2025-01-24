const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");
const path = require("path");
const formFields = require("./updated_addresses.json");

puppeteer.use(StealthPlugin());

const lastIndexPath = process.env.LAST_INDEX_PATH || "./last_index.json";

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
    fs.writeFileSync(lastIndexPath, JSON.stringify({ lastIndex: index }, null, 2));
    console.log("Saved last index:", index);
  } catch (error) {
    console.error("Error saving last index:", error);
  }
};

(async () => {
  let i = loadLastIndex();
  let j = i;

  while (true) {
    console.log(
      "\n********************** order number *********************** ",
      ++j,
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

      const data = formFields[i];
      await page.type('input[name="email"]', data.email, {
        delay: Math.random() * 200 + 50,
      });

      console.log("Form filled with data:", data);
    } catch (error) {
      console.error("Error during automation:", error);
    } finally {
      i++;
      saveLastIndex(i); // Save the current value of `i`
      await browser.close();
      console.log("Browser closed. Restarting process...");
      break; // Exit after one iteration for testing; remove this in production
    }
  }
})();
