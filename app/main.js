const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

let windows = new Set();

app.on('ready', () => {
  createWindow();
});

// Integrating with macOS: 
// Keeping the application alive when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    return false;
  }
  else {
    app.quit();
  }
});

// Creating a window when application is opened and there
// are no windows.
app.on('activate', (event, hasVisibleWindows) => {
  if (!hasVisibleWindows) {
    createWindow();
  }
});

// Function that creates new windows.
const createWindow = exports.createWindow = () => {
  let x, y;

  const currentWindow = BrowserWindow.getFocusedWindow();
  if (currentWindow) {
    const [currentWindowX, currentWindowY] = currentWindow.getPosition();
    x = currentWindowX +10;
    y = currentWindowY +10;
  }

  let newWindow = new BrowserWindow({
    x: x,
    y: y,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true 
    }
  });

  newWindow.loadFile('./app/index.html');

  newWindow.once('ready-to-show', () => {
    newWindow.show();
  });

  // Remove the reference from the set when closing the window.
  newWindow.on('close', () => {
    windows.delete(newWindow);
    newWindow = null;
  });

  windows.add(newWindow);
  return newWindow;
};

// Function that retrieve a text file on user's disk.
const getFileFromUser = exports.getFileFromUser = (targetWindow) => {
  const paths = dialog.showOpenDialogSync(targetWindow, {
    properties: ['openFile'],
    filters: [
      {name: 'Text Files', extension: ['txt']},
      {name: 'Markdown Files', extension: ['md', 'markdown']}
    ]
  });

  if (paths) {
    openFile(targetWindow, paths[0]);
  }
};

// Open a text file and send its content to a renderer process.
const openFile = (targetWindow, path) => {
  const file_content = fs.readFileSync(path).toString();
  targetWindow.webContents.send('file-opened', path, file_content);
};