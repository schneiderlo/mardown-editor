const marked = require('marked');
const path = require('path');
const { remote, ipcRenderer } = require('electron');
const mainProcess = remote.require('./main.js');

// Reference to the current window.
const currentWindow = remote.getCurrentWindow();

// Caching DOM selectors.
const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButton = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');

//  Global variables to keep tracks of changes.
let filePath = null;
let originalContent = '';

// Function updating the UI.
const udpdateUserInterface = (isEdited) => {
  // Change window title.
  let title = 'Fire Sale';
  if (filePath) {
    title = path.basename(filePath) + ' - ' + title;
  }
  if (isEdited) {
    title = '* ' + title;
  }
  currentWindow.setTitle(title);
  currentWindow.setDocumentEdited(isEdited);
};

// Convert markdown to html.
const renderMarkdownToHtml = (markdown) => {
  htmlView.innerHTML = marked(markdown);
};

// Re-render the html when markdown is being edited.
markdownView.addEventListener('keyup', (event) => {
  const currentContent = event.target.value;
  renderMarkdownToHtml(currentContent);
});

// Handle file opening.
openFileButton.addEventListener('click', () => {
  mainProcess.getFileFromUser(currentWindow);
});

ipcRenderer.on('file-opened', (event, path, file_content) => {
  filePath = path;
  originalContent = file_content;
  markdownView.value = file_content;
  renderMarkdownToHtml(file_content);
  udpdateUserInterface();
});

// Handle new file creation.
newFileButton.addEventListener('click', () => {
  mainProcess.createWindow();
});