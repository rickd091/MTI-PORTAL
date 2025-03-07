import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the content for the .env file
const envContent = `# Supabase Configuration
VITE_SUPABASE_URL=https://zrnngescxhrjdzpzujnt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpybm5nZXNjeGhyamR6cHp1am50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNDgxOTAsImV4cCI6MjA1MzYyNDE5MH0.6K1oQZXiFz0WSVau-vsbXN9_4ciTM2Bs1Zc6r4rFfQE

# Application Configuration
VITE_APP_NAME=MTI Portal
VITE_API_URL=http://localhost:5000/api

# Development Settings
VITE_NODE_ENV=development
`;

// Define the path to the .env file
const envPath = path.join(__dirname, '.env');

// Write the content to the .env file
fs.writeFileSync(envPath, envContent);

console.log('.env file has been created successfully!');
