//scripts/verify-typescript.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function verifyTypeScriptSetup() {
  console.log('🔍 Verifying TypeScript setup...\n');

  // Check TypeScript installation
  try {
    const tscVersion = execSync('npx tsc --version').toString();
    console.log('✅ TypeScript is installed:', tscVersion);
  } catch (error) {
    console.error('❌ TypeScript is not installed properly');
    process.exit(1);
  }

  // Check tsconfig.json
  try {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    console.log('✅ tsconfig.json is valid');
  } catch (error) {
    console.error('❌ tsconfig.json is missing or invalid');
    process.exit(1);
  }

  // Check TypeScript files
  const extensionsToCheck = ['.ts', '.tsx'];
  const issues = [];
  
  function checkDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !filePath.includes('node_modules')) {
        checkDirectory(filePath);
      } else if (extensionsToCheck.some(ext => file.endsWith(ext))) {
        try {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          
          // Basic syntax checks
          if (!fileContent.includes('import') && !fileContent.includes('export')) {
            issues.push(`Warning: ${filePath} might be missing imports/exports`);
          }
          
          // Check for common TypeScript patterns
          if (fileContent.includes('any')) {
            issues.push(`Warning: ${filePath} contains 'any' type`);
          }
        } catch (error) {
          issues.push(`Error reading ${filePath}: ${error.message}`);
        }
      }
    });
  }

  console.log('\n🔍 Checking TypeScript files...');
  checkDirectory('./src');

  if (issues.length > 0) {
    console.log('\n⚠️ Potential issues found:');
    issues.forEach(issue => console.log(`- ${issue}`));
  } else {
    console.log('✅ No major issues found in TypeScript files');
  }

  // Run type checking
  try {
    console.log('\n🔍 Running type check...');
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
    console.log('✅ Type checking passed');
  } catch (error) {
    console.error('❌ Type checking failed');
    // Don't exit here as we want to show the summary
  }

  console.log('\n📝 Summary of TypeScript setup:');
  console.log('- TypeScript is installed and configured');
  console.log('- tsconfig.json is present and valid');
  console.log(`- Found ${issues.length} potential issues to review`);
}

verifyTypeScriptSetup();