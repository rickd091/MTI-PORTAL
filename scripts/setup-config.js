// scripts/setup-config.js
const fs = require('fs');
const path = require('path');

// Update TypeScript configuration
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
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "build"]
};

// Craco configuration for path aliases
const cracoConfig = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  typescript: {
    enableTypeChecking: true
  }
};

// Create or update configuration files
fs.writeFileSync(
  path.join(__dirname, '../tsconfig.json'),
  JSON.stringify(tsconfig, null, 2)
);

fs.writeFileSync(
  path.join(__dirname, '../craco.config.js'),
  `module.exports = ${JSON.stringify(cracoConfig, null, 2)};`
);