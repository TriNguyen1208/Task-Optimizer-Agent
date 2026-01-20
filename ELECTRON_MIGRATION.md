# TaskFlow Electron Migration Guide

This document outlines the conversion from a Next.js web app to an Electron desktop application.

## What Changed

### 1. Project Structure
- **Removed**: Next.js app router (`app/` directory) - kept for reference only
- **Added**: React entry point at `src/App.tsx` and `src/index.tsx`
- **Added**: Electron main process in `public/electron.js`
- **Added**: Preload script in `public/preload.js`

### 2. Dependencies
- **Removed**: `next`, `@vercel/analytics`
- **Added**: `electron`, `electron-builder`, `react-scripts`, `concurrently`, `wait-on`, `electron-is-dev`

### 3. Configuration Files
- **New**: `public/index.html` - React DOM root
- **New**: `electron-builder.yml` - Electron build configuration
- **New**: `src/react-app-env.d.ts` - TypeScript definitions for Electron IPC

### 4. Build Scripts
The package.json has been updated with new scripts:
- `npm run dev` - Start development server (runs React + Electron)
- `npm run build` - Build production distributable
- `npm run start` - Run built application
- `npm run react-start` - React dev server only
- `npm run react-build` - React production build only

## Development Workflow

### First-time Setup
```bash
npm install
npm run dev
```

The app will:
1. Start React dev server on http://localhost:3000
2. Auto-reload Electron window when React code changes
3. Open DevTools automatically for debugging

### Building for Production
```bash
npm run build
```

This will:
1. Build React app
2. Copy files to dist/
3. Package with electron-builder
4. Create installers for Windows, macOS, and Linux

## Desktop-Specific Features

### Using Electron IPC (Inter-Process Communication)

The app exposes a safe IPC interface through the preload script:

```typescript
// In any React component
const getVersion = async () => {
  const version = await window.electron.ipcRenderer.invoke('get-app-version');
  console.log('App version:', version);
};
```

### Adding New IPC Handlers

1. In `public/electron.js`, add a new handler:
```javascript
ipcMain.handle('my-channel', async (event, arg) => {
  // Handle request
  return result;
});
```

2. In React components, call it:
```typescript
const result = await window.electron.ipcRenderer.invoke('my-channel', data);
```

## Troubleshooting

### Port 3000 Already in Use
If React dev server fails to start, the port is in use. You can:
- Kill the process on port 3000
- Change the port in the Electron main.js file
- Use a different port with: `PORT=3001 npm run dev`

### Electron Won't Start
1. Ensure you have Node.js installed (v14+)
2. Try clearing node_modules: `rm -rf node_modules && npm install`
3. Check that React dev server is running on http://localhost:3000

### App Won't Build
1. Ensure electron-builder is installed: `npm install electron-builder --save-dev`
2. Check that build/ directory exists after `npm run react-build`
3. On Windows, you may need to install Visual Studio Build Tools

## Component Compatibility

All existing React components from the web app are compatible with Electron.
No changes are needed to shadcn/ui components or custom components.

## File Structure Reference

```
project/
├── src/
│   ├── App.tsx           (Main app component)
│   ├── index.tsx         (React entry point)
│   ├── index.css         (Global styles)
│   └── react-app-env.d.ts (TypeScript definitions)
├── public/
│   ├── index.html        (HTML template)
│   ├── electron.js       (Electron main process)
│   └── preload.js        (IPC preload script)
├── components/           (Reusable React components)
├── app/
│   ├── globals.css       (Tailwind + design tokens)
│   └── layout.tsx        (Kept for reference)
├── hooks/                (Custom React hooks)
├── lib/                  (Utilities)
├── electron-builder.yml  (Build configuration)
└── package.json          (Dependencies & scripts)
```

## Next Steps

1. Test the app with `npm run dev`
2. Build for your platform with `npm run build`
3. Install and test the packaged app
4. Add desktop-specific features using IPC handlers
5. Distribute to users (or set up auto-updates)
