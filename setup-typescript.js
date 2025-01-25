//setup-typescript.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration files
const tsconfig = {
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"]
    }
  },
  "include": ["src"]
};

// Install required dependencies
console.log('Installing TypeScript dependencies...');
execSync('npm install --save typescript @types/react @types/react-dom @types/node');

// Create tsconfig.json
console.log('Creating TypeScript configuration...');
fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));

// Convert JS files to TS
const convertJsToTs = (directory) => {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      convertJsToTs(filePath);
    } else if (file.endsWith('.js')) {
      const newPath = filePath.replace('.js', '.tsx');
      fs.renameSync(filePath, newPath);
      console.log(`Converted ${file} to TypeScript`);
    }
  });
};

console.log('Converting files to TypeScript...');
convertJsToTs('./src/components');

console.log('TypeScript setup complete!');