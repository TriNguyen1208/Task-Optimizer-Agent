import {app, BrowserWindow} from 'electron'
import path from 'path'

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({})

  const indexPath = path.join(app.getAppPath(), 'build', 'index.html')
  mainWindow.loadFile(indexPath)
})