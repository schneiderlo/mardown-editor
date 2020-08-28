const { app, BrowserWindow } = require('electron');

let mainWindow = null;

app.on('ready', () => {

  mainWindow = new BrowserWindow({
    show: false
  });

  mainWindow.loadFile('./app/index.html');

  // Show the main window when the html is loaded to
  // avoid showing a blank page when the application launch.
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', () => {
    mainWindow = null;
  });
});