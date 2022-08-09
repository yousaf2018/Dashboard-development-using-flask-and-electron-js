const {
    app,
    BrowserWindow
} = require("electron")
require('electron-reload')(__dirname)

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 600
    })
    mainWindow.loadFile('src/ui/index.html')
    mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()
})