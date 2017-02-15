'use strict'

const {app, BrowserWindow, Menu, Tray} = require('electron')

app.on('window-all-closed', function () {
  if (process.platform != 'darwin')
    app.quit()
})

let mainWindow = null
let tray = null
let isQuitting = false

let trayMenu = Menu.buildFromTemplate([
  { label: 'Exit RainCollector', click: () => {
    isQuitting = true
    app.quit()
  }}
])

let windowConfig = {
  //width: 800, 
    //height: 600,
    title: 'RainCollector',
    minimizable: false,
    fullscreenable: false,
    show: false,
    fullscreen: false,
    titleBarStyle: 'hidden',
    icon: __dirname + '/app.ico',
    skipTaskbar: false,
    //frame: false, //hide the whole frame, i want that once the app detects it's run by eletron and adjusts the layout
    webPreferences: {
      devTools: false
    }
}

function createTrayIcon () {
  if(tray === null) {
    tray = new Tray(__dirname + '/app.ico')
    tray.setToolTip('RainCollector')
    tray.setContextMenu(trayMenu)

    tray.on('click', (event) => {
      mainWindow.show()
    })
  }
}

function openWindow() {
  mainWindow = new BrowserWindow(windowConfig)

  mainWindow.loadURL('http://www.dukfaar.com')

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    mainWindow.maximize()
  })

  mainWindow.on('close', function (event) {
    if(!isQuitting) {
      event.preventDefault()
      mainWindow.hide()
    }
    return false
  })

  mainWindow.setMenu(null)

  createTrayIcon()
}

app.on('ready', openWindow)

app.on('activate', () => {
  if (mainWindow === null) openWindow()
})