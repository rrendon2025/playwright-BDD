const reporter = require('multiple-cucumber-html-reporter');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Get environment information
const getEnvironmentInfo = () => {
  return {
    browser: process.env.BROWSER || 'chromium',
    browserVersion: 'latest',
    platform: {
      name: process.platform,
      version: os.release()
    }
  };
};

// Create report
reporter.generate({
  jsonDir: path.join(process.cwd(), 'src', 'reports'),
  reportPath: path.join(process.cwd(), 'src', 'reports', 'html-report'),
  displayDuration: true,
  pageTitle: 'Playwright BDD Test Report',
  reportName: 'Playwright BDD Test Report',
  metadata: {
    browser: {
      name: process.env.BROWSER || 'chromium',
      version: 'latest'
    },
    device: 'Local test machine',
    platform: {
      name: process.platform,
      version: os.release()
    }
  },
  customData: {
    title: 'Run Information',
    data: [
      { label: 'Project', value: 'Playwright BDD' },
      { label: 'Base URL', value: process.env.BASE_URL || 'https://www.saucedemo.com' },
      { label: 'Headless', value: process.env.HEADLESS === 'true' ? 'Yes' : 'No' },
      { label: 'Node Version', value: process.version },
      { label: 'Date', value: new Date().toISOString() }
    ]
  }
});

console.log('🚀 Cucumber HTML report generated successfully 👍'); 