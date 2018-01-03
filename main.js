"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow, ipcMain = _a.ipcMain;
var path = require('path');
var url = require('url');
var view_folder = "/Views";
var fs = require('fs');
app.commandLine.appendSwitch('remote-debugging-port', '9222');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var win;
var taskWindow;
function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({ width: 1024, height: 768 });
    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname + view_folder, 'MainView.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Emitted when the window is closed.
    win.on('closed', function () {
        win = null;
    });
}
ipcMain.on("showTaskCreationWindow", function () {
    taskWindow = new BrowserWindow({ width: 400, height: 800 });
    taskWindow.loadURL(url.format({
        pathname: path.join(__dirname + view_folder, 'TaskCreationView.html'),
        protocol: 'file:',
        slashes: true
    }));
    taskWindow.on('closed', function () {
        taskWindow = null;
    });
});
ipcMain.on("taskCreated", function (event, arg) {
    win.webContents.send("taskCreatedAndReady", arg);
    taskWindow.close();
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});
app.on();
//# sourceMappingURL=main.js.map