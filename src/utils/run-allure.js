const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Create directories recursively
 * @param {string} dirPath Directory path to create
 */
function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
  }
}

/**
 * Run a command with error handling
 * @param {string} command Command to run
 * @param {number} index Command index for logging
 * @param {number} total Total number of commands
 */
function runCommand(command, index, total) {
  console.log(`\n[${index + 1}/${total}] Running: ${command}\n`);
  try {
    execSync(command, { stdio: 'inherit', shell: true });
    return true;
  } catch (error) {
    console.error(`\n❌ Error executing command: ${command}`);
    console.error(error.message);
    
    // Special handling for Allure commands
    if (command.includes('allure')) {
      console.log('\n⚠️ Allure command failed. Trying alternative method...');
      return false;
    }
    
    throw error;
  }
}

/**
 * Generate Allure report based on OS
 */
function generateAllureReport() {
  console.log('\n📊 Generating Allure report...');
  const isWindows = os.platform() === 'win32';
  
  if (isWindows) {
    // On Windows, use the batch file
    if (fs.existsSync('generate-allure.bat')) {
      console.log('Using generate-allure.bat for Windows...');
      try {
        execSync('generate-allure.bat', { stdio: 'inherit', shell: true });
        return true;
      } catch (error) {
        console.error('❌ Error running generate-allure.bat:', error.message);
        console.log('\n⚠️ Please try running generate-allure.bat manually');
        return false;
      }
    } else {
      console.error('❌ generate-allure.bat not found');
      return false;
    }
  } else {
    // On Linux/Mac, try the direct approach
    try {
      execSync('npx allure generate allure-results -o allure-report --clean', { stdio: 'inherit', shell: true });
      execSync('npx allure open allure-report', { stdio: 'inherit', shell: true });
      return true;
    } catch (error) {
      console.error('❌ Error generating Allure report:', error.message);
      return false;
    }
  }
}

/**
 * Run commands sequentially
 * @param {string[]} commands Array of commands to run
 * @param {string} tags Optional cucumber tags to filter tests
 */
function runSequential(commands, tags = '') {
  console.log('🚀 Starting Allure test sequence...');
  
  try {
    // Create necessary directories
    const testResultsDir = path.join(process.cwd(), 'test-results');
    const screenshotsDir = path.join(testResultsDir, 'screenshots');
    const videosDir = path.join(testResultsDir, 'videos');
    const allureResultsDir = path.join(process.cwd(), 'allure-results');
    const allureReportDir = path.join(process.cwd(), 'allure-report');
    
    console.log('\n📁 Creating necessary directories...');
    createDirectory(testResultsDir);
    createDirectory(screenshotsDir);
    createDirectory(videosDir);
    createDirectory(allureResultsDir);
    createDirectory(allureReportDir);
    
    // Add tags to cucumber command if provided
    if (tags) {
      const cucumberCommandIndex = commands.findIndex(cmd => cmd.includes('cucumber-js'));
      if (cucumberCommandIndex !== -1) {
        commands[cucumberCommandIndex] = `${commands[cucumberCommandIndex]} --tags "${tags}"`;
      }
    }
    
    // Execute each core command (excluding Allure)
    const coreCommands = commands.filter(cmd => !cmd.includes('allure'));
    for (let i = 0; i < coreCommands.length; i++) {
      const success = runCommand(coreCommands[i], i, coreCommands.length);
      if (!success) {
        throw new Error(`Failed to execute command: ${coreCommands[i]}`);
      }
    }
    
    // Generate Allure report
    const reportSuccess = generateAllureReport();
    if (!reportSuccess) {
      console.log('\n⚠️ Could not automatically generate or open the Allure report.');
      console.log('Please try running generate-allure.bat manually (on Windows)');
      console.log('Or run these commands manually:');
      console.log('npx allure generate allure-results -o allure-report --clean');
      console.log('npx allure open allure-report');
    }
    
    console.log('\n✅ Test execution completed successfully!');
  } catch (error) {
    console.error('\n❌ Error executing commands:', error.message);
    process.exit(1);
  }
}

// Determine which command set to run based on command line arguments
const args = process.argv.slice(2);
const tags = args[0] || '';

// Base commands for test execution (excluding Allure commands)
const commands = [
  'rimraf allure-results allure-report',
  'rimraf test-results',
  'node src/helpers/allure-env.js',
  'cross-env HEADLESS=false cucumber-js',
  'node src/utils/cucumber-allure-adapter.js'
];

// Run the commands
runSequential(commands, tags); 