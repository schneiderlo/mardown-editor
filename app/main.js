const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

let mainWindow = null;

app.on('ready', () => {

  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true 
    }
  });

  mainWindow.loadFile('./app/index.html');

  // Show the main window when the html is loaded to
  // avoid showing a blank page when the application launch.
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // mainWindow.webContents.openDevTools();
    getFileFromUser();
  });

  mainWindow.on('close', () => {
    mainWindow = null;
  });
});

// Function that retrieve a text file on user's disk.
const getFileFromUser = exports.getFileFromUser = () => {
  const files = dialog.showOpenDialogSync(mainWindow, {
    properties: ['openFile'],
    filters: [
      {name: 'Text Files', extension: ['txt']},
      {name: 'Markdown Files', extension: ['md', 'markdown']}
    ]
  });

  if (!files) {
    return;
  }

  const file = files[0];
  const file_content = fs.readFileSync(file).toString();

  console.log(file_content);
};