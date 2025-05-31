const path = require('path');

module.exports = {
  default: {
    parallel: 2,
    format: [
      'progress-bar',
      'html:src/reports/cucumber-report.html',
      'json:src/reports/cucumber-report.json',
      '@cucumber/pretty-formatter'
    ],
    paths: ['src/features/**/*.feature'],
    require: ['src/steps/**/*.ts'],
    requireModule: ['ts-node/register'],
    timeout: 60000
  }
} 