const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Paths
const cucumberJsonPath = path.join(process.cwd(), 'src', 'reports', 'cucumber-report.json');
const allureResultsDir = path.join(process.cwd(), 'allure-results');

// Ensure allure-results directory exists
if (!fs.existsSync(allureResultsDir)) {
  fs.mkdirSync(allureResultsDir, { recursive: true });
}

// Read Cucumber JSON report
try {
  console.log('Reading Cucumber JSON report...');
  const cucumberResults = JSON.parse(fs.readFileSync(cucumberJsonPath, 'utf8'));
  
  // Process each feature file
  cucumberResults.forEach(feature => {
    console.log(`Processing feature: ${feature.name || 'Unknown Feature'}`);
    
    // Process each scenario
    feature.elements.forEach(scenario => {
      if (scenario.type !== 'scenario') return; // Skip backgrounds or other elements
      
      console.log(`  Processing scenario: ${scenario.name || 'Unknown Scenario'}`);
      
      // Create Allure test result file
      const testResult = {
        uuid: uuidv4(),
        historyId: `${feature.name}_${scenario.name}`.replace(/[^a-zA-Z0-9]/g, '_'),
        name: scenario.name || 'Unknown Scenario',
        fullName: `${feature.name}: ${scenario.name}`,
        status: 'passed', // Default status
        stage: 'finished',
        start: scenario.start_timestamp ? new Date(scenario.start_timestamp).getTime() : Date.now(),
        stop: Date.now(),
        labels: [
          { name: 'feature', value: feature.name || 'Unknown Feature' },
          { name: 'story', value: scenario.name || 'Unknown Scenario' },
          { name: 'tag', value: 'Cucumber' },
          { name: 'framework', value: 'Cucumber BDD' },
          { name: 'language', value: 'JavaScript' },
          { name: 'host', value: process.env.COMPUTERNAME || 'Unknown' },
          { name: 'suite', value: feature.name || 'Unknown Feature' }
        ],
        parameters: [
          { name: 'Browser', value: process.env.BROWSER || 'chromium' },
          { name: 'Headless', value: process.env.HEADLESS === 'false' ? 'No' : 'Yes' },
          { name: 'Base URL', value: process.env.BASE_URL || 'https://www.saucedemo.com' }
        ],
        steps: [],
        attachments: []
      };
      
      // Extract and process steps
      scenario.steps.forEach((step, index) => {
        const stepResult = {
          name: step.name || `Step ${index + 1}`,
          status: step.result?.status?.toLowerCase() || 'passed',
          stage: 'finished',
          start: step.start_timestamp ? new Date(step.start_timestamp).getTime() : testResult.start + index * 1000,
          stop: step.start_timestamp && step.result?.duration ? new Date(step.start_timestamp).getTime() + step.result.duration : testResult.start + (index + 1) * 1000,
          parameters: []
        };
        
        // Add step to test result
        testResult.steps.push(stepResult);
        
        // Check if step failed
        if (step.result?.status === 'failed') {
          testResult.status = 'failed';
          testResult.statusDetails = {
            message: step.result.error_message || 'Step failed without error message',
            trace: step.result.error_message || 'Step failed without error message'
          };
        } else if (step.result?.status === 'skipped' && testResult.status !== 'failed') {
          testResult.status = 'skipped';
        }
        
        // Look for attachments (screenshots)
        if (step.embeddings && step.embeddings.length > 0) {
          step.embeddings.forEach((embedding, i) => {
            if (embedding.mime_type === 'image/png') {
              const attachmentFileName = `${uuidv4()}-attachment.png`;
              const attachmentPath = path.join(allureResultsDir, attachmentFileName);
              
              // Write attachment file
              fs.writeFileSync(attachmentPath, Buffer.from(embedding.data, 'base64'));
              
              // Add attachment to test result
              testResult.attachments.push({
                name: `Screenshot after ${step.keyword} ${step.name}`,
                source: attachmentFileName,
                type: 'image/png'
              });
            }
          });
        }
      });
      
      // Write test result to file
      const testResultFileName = `${testResult.uuid}-result.json`;
      const testResultPath = path.join(allureResultsDir, testResultFileName);
      fs.writeFileSync(testResultPath, JSON.stringify(testResult, null, 2));
      console.log(`    Created Allure test result: ${testResultFileName}`);
    });
  });
  
  console.log('Successfully converted Cucumber results to Allure format.');
} catch (error) {
  console.error('Error processing Cucumber results:', error);
} 