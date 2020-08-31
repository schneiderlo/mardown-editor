const marked = require('marked');
const { remote } = require('electron');
const mainProcess = remote.require('./main.js');

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
  mainProcess.getFileFromUser();
});