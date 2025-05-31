import * as allure from 'allure-js-commons';
import { ContentType } from 'allure-js-commons';
import { After, AfterStep, Before, BeforeStep } from '@cucumber/cucumber';
import { getPage } from './playwright';
import * as fs from 'fs';
import * as path from 'path';

// Create allure-results directory if it doesn't exist
const allureResultsDir = path.resolve(process.cwd(), 'allure-results');
if (!fs.existsSync(allureResultsDir)) {
  fs.mkdirSync(allureResultsDir, { recursive: true });
}

// Create Allure runtime
const allureReporter = new allure.AllureRuntime({ resultsDir: allureResultsDir });
let allureTest: any = null;
let stepCount = 0;

// Before each scenario
Before(function(this: any, scenario: any) {
  // Create test in Allure
  const featureName = scenario.pickle?.uri?.split('/').pop().replace('.feature', '') || 'Unknown Feature';
  const scenarioName = scenario.pickle?.name || 'Unknown Scenario';

  // Start new test - using any to bypass TypeScript checking as API may have changed
  const group = (allureReporter as any).startGroup(featureName);
  allureTest = group.startTest(scenarioName);
  
  allureTest.addLabel('feature', featureName);
  allureTest.addLabel('story', scenarioName);
  
  // Reset step counter
  stepCount = 0;
  
  // Add browser information
  allureTest.addParameter('Browser', process.env.BROWSER || 'chromium');
  allureTest.addParameter('Headless', process.env.HEADLESS === 'true' ? 'Yes' : 'No');
  allureTest.addParameter('Base URL', process.env.BASE_URL || 'https://www.saucedemo.com');
});

// After each scenario
After(async function(this: any, scenario: any) {
  if (!allureTest) return;
  
  try {
    // Take screenshot at the end
    const page = getPage();
    if (page) {
      const screenshot = await page.screenshot({ fullPage: true });
      const fileName = `screenshot-${Date.now()}.png`;
      const filePath = path.join(allureResultsDir, fileName);
      
      fs.writeFileSync(filePath, screenshot);
      
      allureTest.addAttachment(
        'Final Screenshot',
        ContentType.PNG,
        screenshot
      );
    }
    
    // Set test status
    if (scenario.result?.status === 'PASSED') {
      allureTest.setStatus('passed');
    } else if (scenario.result?.status === 'FAILED') {
      allureTest.setStatus('failed');
      if (scenario.result?.message) {
        allureTest.setStatusDetails({
          message: scenario.result.message,
          trace: scenario.result.message
        });
      }
    } else {
      allureTest.setStatus('skipped');
    }
  } catch (error) {
    console.error('Error in Allure After hook:', error);
  } finally {
    // End the test
    if (allureTest) {
      allureTest.endTest();
      allureTest = null;
    }
  }
});

// Before each step
BeforeStep(function(this: any) {
  stepCount++;
});

// After each step
AfterStep(async function(this: any, step: any) {
  if (!allureTest) return;
  
  try {
    const stepName = step.pickleStep?.text || `Step ${stepCount}`;
    
    // Create step in Allure
    const allureStep = allureTest.startStep(stepName);
    
    // Take screenshot after step
    const page = getPage();
    if (page) {
      const screenshot = await page.screenshot({ fullPage: true });
      allureStep.addAttachment('Screenshot', ContentType.PNG, screenshot);
    }
    
    // Set step status
    if (step.result?.status === 'PASSED') {
      allureStep.setStatus('passed');
    } else if (step.result?.status === 'FAILED') {
      allureStep.setStatus('failed');
      if (step.result?.message) {
        allureStep.setStatusDetails({
          message: step.result.message,
          trace: step.result.message
        });
      }
    } else {
      allureStep.setStatus('skipped');
    }
    
    allureStep.endStep();
  } catch (error) {
    console.error('Error in Allure AfterStep hook:', error);
  }
});

// Helper functions for use in step definitions
export function addAllureAttachment(name: string, content: Buffer | string, type: ContentType): void {
  if (allureTest) {
    allureTest.addAttachment(name, type, content);
  }
}

export function addAllureStep(name: string, status: 'passed' | 'failed' | 'skipped' | 'broken'): void {
  if (allureTest) {
    const step = allureTest.startStep(name);
    step.setStatus(status);
    step.endStep();
  }
}

export function setAllureParameter(name: string, value: string): void {
  if (allureTest) {
    allureTest.addParameter(name, value);
  }
}

export default allureReporter; 