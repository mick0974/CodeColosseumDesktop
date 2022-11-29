const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');



let win;
const args = process.argv.slice(1),
    serve = args.some(val => val === '--serve');

function createWindow() {
    win = new BrowserWindow({
        //fullscreen: true,
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    if (serve) {
        // const electronReload = require('electron-reload')
        // win.webContents.openDevTools();
        // require('electron-reload')(__dirname, {
        //     electron: require(path.join(__dirname, '/../node_modules/electron'))
        // });
        win.loadURL('http://localhost:4200');
    } else {
        win.loadFile('dist/index.html')
    }
}

app.whenReady().then(() => {
    createWindow()


    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })


    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') app.quit()
    })

    app.on('browser-window-focus', function () {
        globalShortcut.register("CommandOrControl+R", () => {
            console.log("CommandOrControl+R is pressed: Shortcut Disabled");
        });
        globalShortcut.register("CommandOrControl+Shift+R", () => {
            console.log("CommandOrControl+Shift+R is pressed: Shortcut Disabled");
        });
        globalShortcut.register("F5", () => {
            console.log("F5 is pressed: Shortcut Disabled");
        });
    });
    app.on('browser-window-blur', function () {
        globalShortcut.unregister('CommandOrControl+R');
        globalShortcut.unregister('CommandOrControl+Shift+R');
        globalShortcut.unregister('F5');
    });


    // setInterval(() => {
    //     let str = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    //     console.log(str);

    //     win.webContents.send("pipeTest", str);
    // }, 1000);

})