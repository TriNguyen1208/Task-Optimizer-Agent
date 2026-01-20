const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Building TaskFlow Electron App...\n');

try {
  // Build React app
  console.log('1. Building React app...');
  execSync('npm run react-build', { stdio: 'inherit' });

  // Ensure dist directories exist
  const distDir = path.join(__dirname, 'dist');
  const electronDir = path.join(distDir, 'electron');
  const reactDir = path.join(distDir, 'react');

  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);
  if (!fs.existsSync(electronDir)) fs.mkdirSync(electronDir);
  if (!fs.existsSync(reactDir)) fs.mkdirSync(reactDir);

  // Copy Electron files
  console.log('\n2. Copying Electron files...');
  fs.copyFileSync(
    path.join(__dirname, 'public', 'electron.js'),
    path.join(electronDir, 'main.js')
  );
  fs.copyFileSync(
    path.join(__dirname, 'public', 'preload.js'),
    path.join(electronDir, 'preload.js')
  );

  // Copy React build to dist
  console.log('3. Copying React build...');
  const buildDir = path.join(__dirname, 'build');
  if (fs.existsSync(buildDir)) {
    execSync(`cp -r "${buildDir}" "${reactDir}"`, { shell: true });
  }

  // Build Electron app
  console.log('\n4. Building Electron app...');
  execSync('electron-builder', { stdio: 'inherit' });

  console.log('\nBuild completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
