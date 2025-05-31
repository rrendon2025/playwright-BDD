# Playwright BDD Automation Framework

A robust automation framework built with Playwright, TypeScript, and Cucumber.js for BDD-style testing.

## Features

- Page Object Model design pattern
- BDD approach with Cucumber.js
- TypeScript for type safety
- Allure reporting integration
- Cross-browser testing
- Environment configuration via .env file
- Screenshot capture on test failures
- Cross-platform compatibility (Windows, Linux, macOS)

## Prerequisites

- Node.js (v16 or later)
- npm (v7 or later)
- Java (required for Allure reporting)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/rrendon2025/playwright-BDD.git
cd playwright-BDD
```

2. Install dependencies and Playwright browsers (recommended):
```bash
npm run install
```

Alternatively, install only npm dependencies:
```bash
npm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```
BROWSER=chromium
HEADLESS=true
BASE_URL=https://www.saucedemo.com
STANDARD_USER=standard_user
PASSWORD=secret_sauce
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run specific test suites
```bash
npm run test:login       # Run login tests
```

### Run tests with GUI (browser visible)
```bash
npm run test:gui         # Run all tests with browser visible
npm run test:gui:login   # Run login tests with browser visible
```

### Run tests with Allure reporting

#### All-in-one commands (recommended)
These commands will run tests, generate the Allure report, and open it in your browser - all in one step:

```bash
# Headless mode (CLI execution)
npm run test:allure:full          # Run all tests in headless mode with Allure report

# With browser visible (video recording)
npm run test:allure:full:video    # Run all tests with browser visible and Allure report
npm run test:allure:full:login    # Run login tests with browser visible and Allure report
```

#### Two-step approach
If you prefer more control, you can run these commands separately:

1. First run tests and prepare Allure results:
```bash
npm run test:gui:allure          # Run all tests and prepare Allure results
npm run test:gui:allure:login    # Run login tests and prepare Allure results
```

2. Then generate and view the Allure report:
```bash
npm run allure:report    # Generate and open the Allure report
```

Or run these steps individually:
```bash
npm run allure:generate  # Generate the Allure report
npm run allure:open      # Open the Allure report in a browser
```

## Project Maintenance

### First-time Setup
For a new clone or installation on a different machine:
```bash
npm run install  # Install all dependencies and Playwright browsers
```

### Cleaning Up
To remove dependencies and keep project size minimal:
```bash
npm run clean  # Remove node_modules and package-lock.json
```

To perform a complete cleanup of all generated files:
```bash
npm run clean:all  # Remove node_modules, test results, reports, and package-lock.json
```

### Reset Project
To completely reset the project and reinstall dependencies:
```bash
npm run reset  # Clean all files and reinstall dependencies
```

## Test Reports

### Cucumber HTML Reports
Cucumber HTML reports are generated in `src/reports/cucumber-html-report.html`.

### Allure Reports
Allure reports are generated in the `allure-report` directory. After generating the report, it should automatically open in your default browser.

## Project Structure

```
playwright-BDD/
├── allure-results/       # Raw Allure results
├── allure-report/        # Generated Allure reports
├── src/
│   ├── features/         # Cucumber feature files
│   ├── helpers/          # Helper scripts
│   ├── pages/            # Page Object Model classes
│   ├── reports/          # Test reports
│   ├── steps/            # Cucumber step definitions
│   └── utils/            # Utility functions
├── test-results/         # Test results, screenshots, and videos
│   ├── screenshots/      # Screenshots captured during tests
│   └── videos/           # Videos recorded during tests
├── .env                  # Environment variables
├── .gitignore            # Git ignore configuration
├── cucumber.js           # Cucumber configuration
├── package.json          # Project dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Troubleshooting

### Allure Report Issues
If you encounter issues with the Allure report:

1. **Ensure Java is installed** - Allure requires Java to run. Install the latest JDK or JRE.

2. **Check the allure-results directory** - Make sure it contains the test results files.

3. **Run commands individually** - If combined commands fail, try running them one by one:
   ```bash
   npm run allure:clear
   npm run allure:generate
   npm run allure:open
   ```

4. **Update allure-commandline** - Try reinstalling:
   ```bash
   npm install allure-commandline@latest --save-dev
   ```

## Step Navigation in Feature Files

To enable Ctrl+Click navigation from feature files to step definitions:

1. Install the "Cucumber (Gherkin) Full Support" extension in VSCode/Cursor

## Test Cases

### Login Tests
- TC1: Verify Title Page
- TC2: Login with valid credentials
- TC3: Login with invalid credentials

### Inventory Tests
- TC1: Validate Sauce Labs Backpack product details
- TC2: Add Sauce Labs Backpack to cart

## Key Features

- Cross-platform compatibility (Windows, Linux, macOS)
- Uses a single browser instance for all tests
- Environment variables are stored in a root-level `.env` file
- Automatically manages test result directories (screenshots, videos)
- Generates comprehensive HTML and Allure reports


npm run test:allure:full
npm run test:allure:full:video 


## Author
Ralph Harris rendon