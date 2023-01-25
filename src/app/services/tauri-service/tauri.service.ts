import { Injectable, OnInit } from "@angular/core";
import { Child, Command, open as ShellOpen } from '@tauri-apps/api/shell';
import { fs, path } from '@tauri-apps/api';
import { type } from '@tauri-apps/api/os';
import { E } from "@tauri-apps/api/shell-cbf4da8b";

@Injectable({
  providedIn: 'root'
})
export class TauriService {
  public child: Child | undefined;
  public filepath: string = "./../data/executable";
  public absoluteFilePath = "";

  public inputBuffer = new Array<string>();

  constructor(){}

  async uploadFile(file: any, onFileWritten:()=>void, onError:(reason:any)=>void){
    let filereader = new FileReader();

    const osType = await type();
    
    filereader.onload = ()=>{

      // If we're on windows, we need to add an extension (any extension!)
      // because if the original file has no extension
      // Windows doensn't allow execution. (thank u Bill)
      if (osType=="Windows_NT"){
        this.filepath+=".exe"
      }

      path.resolve(this.filepath).then((absolutepath:string)=>{
        if(filereader.result != null){
          fs.writeBinaryFile(absolutepath, filereader.result as ArrayBuffer).then(()=>{
            
          this.absoluteFilePath = absolutepath;

          // On Linux (and MacOs), in order to be able to execute a file, we need
          // to add exectute permissions.
          if (osType!="Windows_NT"){
            const command = new Command("sh", ["-c", `chmod +x ${absolutepath}`]);

            command.on("close", ()=>{
              onFileWritten();
            })

            command.on("error", (reason)=>{
              onError(reason);
            })

            command.spawn();
          }
          else{
            onFileWritten();
          }

          }, (reason:any)=>{
            onError(reason);
          })
        }
        else{
          onError("Error, the file content was null");
        }
      }, (reason:any)=>{
        onError(reason);
      })
    }
    filereader.onerror = (reason:any)=>{
      onError(reason)
    }

    filereader.readAsArrayBuffer(file);
  }

  async sendToProcess(message: string){
    if(this.child != null){
      if(!message.endsWith("\n")){
        message += "\n";
      }
  
      console.log("Sending to Tauri: " + message + ", process " + this.child?.pid);
  
      this.child?.write(message).then((value) => {
        console.log("Write to Tauri of {" + message + "} successful");
      }, (reason) => {
        console.log("Write to Tauri failed: " + reason);
      });
    }
    else{
      console.log("Tauri process not running yet, saving {" + message + "} into queue");
      this.inputBuffer.push(message);
    }
  }

  async writeInputBuffer(){
    for(let i = 0; i < this.inputBuffer.length; i++){
      let value = this.inputBuffer[i];
      console.log("Writing queued message {" + value + "} to Tauri process");
      await this.sendToProcess(value);
    }
  }

  async execProgram(
    args: string[],
    onProcessStdOut: (output:string)=>void,
    onProcessStdErr?: (error:string)=>void){
      
    const osType = await type();

    let command: Command;
    // TODO! At the moment, spaces in the filepath break the program.
    // In Windows, a new cmd is executed to run the file with its arguments. 
    if (osType == "Windows_NT"){
      command = new Command('sh-windows', [ "/c", `${this.absoluteFilePath} ${args.join(" ")}`], 
        {"encoding": "utf-8"})
    // In Linux/MacOs, sh is used.
    }
    else{
      command = new Command("sh", ["-c", `${this.filepath} ${args.join(" ")}`]);
    }

    command.stdout.on("data", (line: any) => {
      if(!line.endsWith("\n")){
        line += "\n";
      }

      onProcessStdOut(line);
    });
    
    command.stderr.on("data", (line:any) => {
      if(onProcessStdErr){
        onProcessStdErr(line);
      }
    });

    command.on("close", ()=>{
      path.resolve(this.filepath).then((absolutepath:string)=>{
        fs.removeFile(absolutepath).then(()=>{
          console.log("Successfully deleted executable after completion")
        }, (reason)=>{
          console.log("Error, could not delete executable: " + reason);
          if(onProcessStdErr){
            onProcessStdErr(reason);
          }
        })
      }, (reason:any)=>{
        console.log("Error, could not resolve path to executable to delete it: " + reason)
        if(onProcessStdErr){
          onProcessStdErr(reason);
        }
      })
    })

    command.on("error", (error:any)=>{
      console.log("Error occurred during execution: " + error)

      if(onProcessStdErr){
        onProcessStdErr(error);
      }
      
      path.resolve(this.filepath).then((absolutepath:string)=>{
        fs.removeFile(absolutepath).then(()=>{
          console.log("Successfully deleted executable after error")
        }, (reason)=>{
          console.log("Error, could not delete executable: " + reason)
        })
      }, (reason:any)=>{
        console.log("Error, could not resolve path to executable to delete it: " + reason)
      })
    })

    this.child = await command.spawn();

    this.writeInputBuffer();
  }
}