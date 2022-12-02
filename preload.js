const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["pipeTest"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ["pipeTest"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
);

contextBridge.exposeInMainWorld(
    "shell", {
        exec: ( command, args, start, stdout, stderr, exit ) => {
            //alert("exec "+command)
            var timestap = new Date().getTime();
            
            let seed = Math.floor(Math.random() * 1000000);
            let uid = 'uid-'+timestap+'-'+seed;

            var ch_in = 'shell:exec:stdin:'+uid;
            var ch_out = 'shell:exec:stdout:'+uid;
            var ch_err = 'shell:exec:stderr:'+uid;
            var ch_exit = 'shell:exec:exit:'+uid;

            //alert('uid: '+uid);

            ipcRenderer.invoke('shell:exec', uid, command, args).then( (success) => {
                var onOut = (event, srcUid, data, ...args) => { 
                    let content = String.fromCharCode(...data);
                    if(stdout) { stdout(content, ...args); }
                }

                var onErr = (event, srcUid, data, ...args) => { 
                    let content = String.fromCharCode(...data);
                    if(stderr) { stderr(content, ...args); }
                }

                var onExit = (event, srcUid, exitCode, ...args) => { 
                    if(uid != srcUid) {return;}
                    if(stdout){ipcRenderer.removeAllListeners(ch_out)};
                    if(stderr){ipcRenderer.removeAllListeners(ch_err)};
                    ipcRenderer.removeAllListeners(ch_exit);
                    if (exit) { exit(exitCode, ...args); }
                }

                if(stdout){ ipcRenderer.on(ch_out, onOut); }
                if(stderr){ ipcRenderer.on(ch_err, onErr); }
                ipcRenderer.on(ch_exit, onExit);
                
                if(start){ start(uid); }
            });
            return uid;
        },
        stdin: ( uid, data ) => {
            //var ch_in = 'shell:stdin' //'+uid;
            var ch_in = 'shell:exec:stdin:'+uid;
            ipcRenderer.send(ch_in, uid, data); 
            //alert(ch_in +"\n"+ uid + +"\n"+ data);
        }
    }
);