const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { Stream } = require('stream');


const childProcesses={};

let win;
let webView;
const args = process.argv.slice(1),
    serve = args.some(val => val === '--serve');

function createWindow() {
    win = new BrowserWindow({
        //fullscreen: true,
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        useContentSize:true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })    
    
    ipcMain.handle('shell:exec', (event, uid, command, args) => {
        if (uid in childProcesses){ return false; }

        console.log("ipcMain[shell:exec] "+uid);
        console.log("ipcMain[shell:exec] "+command);
        const webContents = event.sender
        const win = BrowserWindow.fromWebContents(webContents)
        
        var ch_in = 'shell:exec:stdin:'+uid;
        var ch_out = 'shell:exec:stdout:'+uid;
        var ch_err = 'shell:exec:stderr:'+uid;
        var ch_exit = 'shell:exec:exit:'+uid;

        if (!args) {var args = []}
        
        const child = spawn(command, args, {detached: true}); //the array is the arguments
        console.log("ipcMain[shell:exec] "+child.pid);

        child.stdout.on('data', (data) => {
            console.log('OUT: ' + data);
            win.webContents.send(ch_out, uid, data);
        });

        child.stderr.on('data', (data) => {
            console.log('ERR: ' + data);
            win.webContents.send(ch_err, uid, data);          
        });

        child.on('close', (code) => {
            delete childProcesses[uid];
            ipcMain.removeAllListeners(ch_in);
            console.log(`EXT: ${code}`);
            win.webContents.send(ch_exit, uid, code); 
        });
        
        ipcMain.on(ch_in, (event, uid, data) => {
            console.log(" IN: "+data);
            const webContents = event.sender
            const win = BrowserWindow.fromWebContents(webContents)
            if(uid in childProcesses){
                var child = childProcesses[uid];
                child.stdin.write(data);
            }
        });
       
        childProcesses[uid]=child;

        console.log("ipcMain[shell:exec] "+uid+" pid "+child.pid);
        return true;
    });    


    if (serve) {
        win.webContents.openDevTools();
        
        /*const electronReload = require('electron-reload')
        require('electron-reload')(__dirname, {
           electron: require(path.join(__dirname, '/../node_modules/electron'))
        });
        */
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
        //globalShortcut.register("CommandOrControl+R", () => {
        //    console.log("CommandOrControl+R is pressed: Shortcut Disabled");
        //});
        //globalShortcut.register("CommandOrControl+Shift+R", () => {
        //    console.log("CommandOrControl+Shift+R is pressed: Shortcut Disabled");
        //});
        //globalShortcut.register("F5", () => {
        //    console.log("F5 is pressed: Shortcut Disabled");
        //});
    });
    app.on('browser-window-blur', function () {
        //globalShortcut.unregister('CommandOrControl+R');
        //globalShortcut.unregister('CommandOrControl+Shift+R');
        //globalShortcut.unregister('F5');
    });
    
    


})
