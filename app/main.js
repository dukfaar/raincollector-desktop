'use strict'

const {app, BrowserWindow, Menu, Tray, ipcMain} = require('electron')

app.on('window-all-closed', function () {
  if (process.platform != 'darwin')
    app.quit()
})

let mainWindow = null
let tray = null
let isQuitting = false

function reloadUrl () {
  mainWindow.loadURL('http://www.dukfaar.com')
  //mainWindow.loadURL('http://localhost:3000')
}

let trayMenu = Menu.buildFromTemplate([
  { label: 'Reload RainCollector', click: () => {
    reloadUrl()
  }},
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
    frame: false, //hide the whole frame, i want that once the app detects it's run by eletron and adjusts the layout
    webPreferences: {
      devTools: false,
      preload: __dirname + '/preload.js'
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

function maximizeWindow () {
  mainWindow.maximize()
}

ipcMain.on('maximize window', (event, arg) => { maximizeWindow() })


function openWindow() {
  mainWindow = new BrowserWindow(windowConfig)
  //mainWindow.webContents.openDevTools()

  reloadUrl()

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