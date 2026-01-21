import {execSync} from 'child_process'
import path from 'path'
import fs from 'fs'

console.log('Starting TaskFlow Electron App in development mode...\n');

try {
  // Ensure Electron file exists
  const electronFile = path.join(__dirname, 'public', 'electron.js');
  if (!fs.existsSync(electronFile)) {
    console.error('electron.js not found. Please run build first.');
    process.exit(1);
  }

  // Start React dev server and Electron in parallel
  console.log('Starting React dev server and Electron app...\n');
  execSync('concurrently "npm run react-start" "wait-on http://localhost:3000 && electron ."', {
    stdio: 'inherit',
    cwd: __dirname,
  });
} catch (error) {
  console.error('Start failed:', error.message);
  process.exit(1);
}
