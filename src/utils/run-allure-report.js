/**
 * Script to reliably generate and open Allure reports
 * Uses direct approach for Windows compatibility
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Get paths
const rootDir = process.cwd();
const allureResultsDir = path.join(rootDir, 'allure-results');
const allureReportDir = path.join(rootDir, 'allure-report');
const isWindows = os.platform() === 'win32';

// Check if allure-results directory exists and has files
if (!fs.existsSync(allureResultsDir) || fs.readdirSync(allureResultsDir).length === 0) {
  console.error('❌ Error: allure-results directory does not exist or is empty');
  process.exit(1);
}

console.log('✅ Allure results directory exists and contains files');

// Define HTML server function to serve the report directly
function createHtmlServer() {
  const express = require('express');
  const app = express();
  const port = 8765;
  
  // Check if allure-report exists
  if (!fs.existsSync(allureReportDir)) {
    fs.mkdirSync(allureReportDir, { recursive: true });
    
    // Copy raw results to report folder to display something
    fs.readdirSync(allureResultsDir).forEach(file => {
      fs.copyFileSync(
        path.join(allureResultsDir, file),
        path.join(allureReportDir, file)
      );
    });
    
    // Create simple index.html
    fs.writeFileSync(
      path.join(allureReportDir, 'index.html'),
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Allure Report</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #4CAF50; }
          .summary { background-color: #f8f8f8; padding: 15px; border-radius: 5px; }
          .file-list { margin-top: 20px; }
          .file { margin-bottom: 5px; padding: 5px; background-color: #eee; }
        </style>
      </head>
      <body>
        <h1>Allure Report (Basic View)</h1>
        <div class="summary">
          <p>Allure report generation failed, but test results are available.</p>
          <p>Total files: ${fs.readdirSync(allureResultsDir).length}</p>
        </div>
        <div class="file-list">
          <h2>Raw Result Files:</h2>
          ${fs.readdirSync(allureResultsDir).map(file => 
            `<div class="file">${file}</div>`
          ).join('')}
        </div>
      </body>
      </html>`
    );
  }
  
  app.use(express.static(allureReportDir));
  
  const server = app.listen(port, () => {
    console.log(`✅ Allure report server started at http://localhost:${port}`);
    
    // Open browser
    const url = `http://localhost:${port}`;
    const openCommand = isWindows ? 
      `start "" "${url}"` : 
      (os.platform() === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`);
    
    try {
      execSync(openCommand, { stdio: 'ignore', shell: true });
      console.log('✅ Browser opened to view report');
    } catch (error) {
      console.error('❌ Error opening browser:', error.message);
      console.log(`🔗 Please open manually: ${url}`);
    }
  });
  
  // Keep server running until user terminates
  console.log('Press Ctrl+C to stop the server...');
}

// Try to generate report with Java (if available)
console.log('📊 Attempting to generate Allure report...');
try {
  // Check if Java is available
  try {
    execSync('java -version', { stdio: 'ignore' });
    console.log('✅ Java found, trying to generate report using Allure Java libraries');
    
    // Path to Allure JAR files in node_modules
    const allureCommandlineDir = path.join(rootDir, 'node_modules', 'allure-commandline');
    const libDir = path.join(allureCommandlineDir, 'dist', 'lib');
    
    if (fs.existsSync(libDir)) {
      // Find all JAR files
      const jarFiles = fs.readdirSync(libDir)
        .filter(file => file.endsWith('.jar'))
        .map(file => path.join(libDir, file));
      
      if (jarFiles.length > 0) {
        // Build classpath
        const classpath = jarFiles.join(isWindows ? ';' : ':');
        
        // Run Allure with Java directly
        const javaCommand = `java -cp "${classpath}" io.qameta.allure.CommandLine generate "${allureResultsDir}" -o "${allureReportDir}" --clean`;
        execSync(javaCommand, { stdio: 'inherit', shell: true });
        
        console.log('✅ Allure report generated successfully using Java');
        
        // Open the report using a simple HTTP server
        createHtmlServer();
      } else {
        throw new Error('No JAR files found in Allure lib directory');
      }
    } else {
      throw new Error(`Allure lib directory not found at ${libDir}`);
    }
  } catch (javaError) {
    console.error('⚠️ Java approach failed:', javaError.message);
    throw new Error('Could not use Java-based approach');
  }
} catch (error) {
  console.log('⚠️ Using simple web server to view raw results...');
  
  // Fallback to simple HTTP server
  try {
    // Check if express is installed
    try {
      require.resolve('express');
    } catch (err) {
      console.log('📦 Installing express package...');
      execSync('npm install express --no-save', { stdio: 'inherit' });
    }
    
    createHtmlServer();
  } catch (serverError) {
    console.error('❌ Error creating HTTP server:', serverError.message);
    console.log('🔍 Please check the raw results in:', allureResultsDir);
  }
} 