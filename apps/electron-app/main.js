// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('node:path');




let mainWindow;

const msgQueue = [];

const createResponseFn = require('./nmh');

const sendResponse = createResponseFn(handleMessage);

function handleMessage(msg) {
    if (!mainWindow) {
      msgQueue.push(msg);
    } else {
      mainWindow.webContents.send('stdin-data', msg);
    }
    
    sendResponse({...msg, response: 'from electron.js'});
}


const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  mainWindow.on('ready-to-show', () => {
    msgQueue.forEach(msg => {
      mainWindow.webContents.send('stdin-data', msg);
    });
  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  createWindow()
  app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})