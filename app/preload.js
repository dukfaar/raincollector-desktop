const {ipcRenderer} = require('electron')

process.once('loaded', () => {
  window.isInElectronApp = true
  window.ipcRenderer = ipcRenderer
})