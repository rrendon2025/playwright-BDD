const fs = require('fs');
const path = require('path');
require('dotenv').config();
const os = require('os');

// Create allure-results directory if it doesn't exist
const allureResultsDir = path.resolve(process.cwd(), 'allure-results');
if (!fs.existsSync(allureResultsDir)) {
  fs.mkdirSync(allureResultsDir, { recursive: true });
}

// Environment properties for Allure
const envProperties = {
  'Browser': process.env.BROWSER || 'chromium',
  'Browser Headless Mode': process.env.HEADLESS === 'true' ? 'Yes' : 'No',
  'Base URL': process.env.BASE_URL || 'https://www.saucedemo.com',
  'Platform': process.platform,
  'OS Release': os.release(),
  'Architecture': os.arch(),
  'Node Version': process.version,
  'Timestamp': new Date().toISOString()
};

// Write environment properties file for Allure
const environmentContent = Object.entries(envProperties)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

fs.writeFileSync(
  path.join(allureResultsDir, 'environment.properties'),
  environmentContent
);
console.log('✅ Allure environment properties written to', path.join(allureResultsDir, 'environment.properties'));

// Create categories.json for Allure
const categories = [
  {
    "name": "Failed tests",
    "matchedStatuses": ["failed"]
  },
  {
    "name": "Broken tests",
    "matchedStatuses": ["broken"]
  },
  {
    "name": "Ignored tests",
    "matchedStatuses": ["skipped"]
  },
  {
    "name": "Passed tests",
    "matchedStatuses": ["passed"]
  }
];

fs.writeFileSync(
  path.join(allureResultsDir, 'categories.json'),
  JSON.stringify(categories, null, 2)
);
console.log('✅ Allure categories written to', path.join(allureResultsDir, 'categories.json'));

// Create executor.json for Allure
const executor = {
  "name": "Playwright BDD",
  "type": "playwright",
  "url": "https://github.com/rrendon2025/playwright-BDD",
  "buildName": `Test run ${new Date().toISOString()}`
};

fs.writeFileSync(
  path.join(allureResultsDir, 'executor.json'),
  JSON.stringify(executor, null, 2)
);
console.log('✅ Allure executor info written to', path.join(allureResultsDir, 'executor.json')); 