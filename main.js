// https://github.com/kondoumh/sbe/tree/master/src

// Modules to control application life and create native browser window
const { app, Menu, BrowserWindow } = require('electron')
const path = require('path')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.


// require('electron-reload')(__dirname);

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

initWindowMenu();

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
function initWindowMenu() {
  const template = [
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        {
          label: "Paste [url title]",
          accelerator: "CmdOrCtrl+L",
          click() {
            mainWindow.webContents.send("pasteUrlTitle");
          }
        },
        { role: "delete" },
        { role: "selectall" },
        { type: "separator" },
        {
          label: "Insert [* 1]",
          accelerator: "CmdOrCtrl+1",
          click() {
            mainWindow.webContents.send("insertHeadline1");
          }
        },
        {
          label: "Insert [** 2]",
          accelerator: "CmdOrCtrl+2",
          click() {
            mainWindow.webContents.send("insertHeadline2");
          }
        },
        {
          label: "Insert [*** 3]",
          accelerator: "CmdOrCtrl+3",
          click() {
            mainWindow.webContents.send("insertHeadline3");
          }
        }
      ]
    },
    {
      label: "View",
      submenu: [
        {
          label: "go back",
          accelerator: "CmdOrCtrl+[",
          click() {
            mainWindow.webContents.send("goBack");
          }
        },
        {
          label: "go forward",
          accelerator: "CmdOrCtrl+]",
          click() {
            mainWindow.webContents.send("goForward");
          }
        },
        {
          label: "new tab",
          accelerator: "CmdOrCtrl+T",
          click() {
            mainWindow.webContents.send("newTab");
          }
        },
        {
          label: "duplicate tab",
          click() {
            mainWindow.webContents.send("duplicateTab");
          }
        },
        {
          label: "close tab",
          accelerator: "CmdOrCtrl+W",
          click() {
            mainWindow.webContents.send("closeTab");
          }
        },
        {
          label: "copy url",
          click() {
            mainWindow.webContents.send("copyUrl");
          }
        },
        {
          label: "reload",
          accelerator: "CmdOrCtrl+R",
          click() {
            mainWindow.webContents.send("reload");
          }
        },
        {
          label: "page list",
          click() {
            mainWindow.webContents.send("showPageList");
          }
        },
        {
          label: "Show linked pages",
          click() {
            mainWindow.webContents.send("showLinkedpages");
          }
        },
        {
          label: "Show user info",
          click() {
            mainWindow.webContents.send("showUserInfo");
          }
        },
        { type: "separator" },
        {
          label: "Search in window",
          accelerator: "CmdOrCtrl+F",
          click() {
            mainWindow.webContents.send("toggleSearch");
          }
        },
        { type: "separator" },
        {
          label: "Show project activties",
          click() {
            mainWindow.webContents.send("showProjectActivities")
          }
        }
      ]
    }
  ];

  if (!app.isPackaged) {
    template.unshift({
      label: "Debug",
      submenu: [
        { role: "forceReload" },
        { role: "toggledevtools" },
        {
          label: "open devTools for Tab",
          click() {
            mainWindow.webContents.send("openDevToolsForTab");
          }
        }
      ]
    });
  }

  if (process.platform === "darwin") {
    template.unshift({
      label: app.getName(),
      submenu: [
        {
          label: "about sbe",
          click() {
            showAboutWindow();
          }
        },
        { type: "separator" },
        { role: "services", submenu: [] },
        { type: "separator" },
        { role: "hide" },
        { role: "hideothers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" }
      ]
    });
  } else {
    template.push({
      label: "help",
      submenu: [
        {
          label: "about sbe",
          click() {
            showAboutWindow();
          }
        }
      ]
    })
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

