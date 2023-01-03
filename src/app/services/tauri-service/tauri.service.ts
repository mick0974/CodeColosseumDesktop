import { Injectable, OnInit } from "@angular/core";
import { Child, Command, open as ShellOpen } from '@tauri-apps/api/shell';
import { resolve } from "dns";
import { timeout } from "rxjs";
import { fs, path } from '@tauri-apps/api';

@Injectable({
  providedIn: 'root'
})
export class TauriService {
  public child: Child | undefined;
  public filepath: string = "./../data/executable";

  public inputBuffer = new Array<string>();

  constructor(){}

  async uploadFile(file: any, onFileWritten:()=>void, onError:(reason:any)=>void){
    let filereader = new FileReader();

    filereader.onload = ()=>{
      path.resolve(this.filepath).then((absolutepath:string)=>{
        if(filereader.result != null){
          fs.writeBinaryFile(absolutepath, filereader.result as ArrayBuffer).then(()=>{
            const command = new Command("sh", ["-c", `chmod +x ${absolutepath}`]);

            command.on("close", ()=>{
              onFileWritten();
            })

            command.on("error", (reason)=>{
              onError(reason);
            })

            command.spawn();

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
  
      this.child.write(message).then((value) => {
        console.log("Write to Tauri of {" + message + "} successful");
      }, (reason) => {
        console.log("Write to Tauri failed: " + reason);
      });
    }
    else{
      this.inputBuffer.push(message);
    }
  }

  writeInputBuffer(){
    console.log("buffer size " + this.inputBuffer.length)
    this.inputBuffer.forEach((value, index, _array) => {
      this.delay(1500 * index).then(()=>{
        this.sendToProcess(value);
      });
    })
  }

  delay(ms:number){
    return new Promise(resolve=>setTimeout(resolve,ms))
  }

  async execProgram(
    onProcessStdOut: (output:string)=>void,
    onProcessStdErr?: (error:string)=>void,
    ...args: string[]){

    //this.filename = "../data/rock-paper-scissor";
    const command = new Command("sh", ["-c", `${this.filepath} ${args.join(" ")}`]);

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
          console.log("Error, could not delete executable: " + reason)
        })
      }, (reason:any)=>{
        console.log("Error, could not resolve path to executable to delete it")
      })
    })

    command.on("error", ()=>{
      path.resolve(this.filepath).then((absolutepath:string)=>{
        fs.removeFile(absolutepath).then(()=>{
          console.log("Successfully deleted executable after error")
        }, (reason)=>{
          console.log("Error, could not delete executable: " + reason)
        })
      }, (reason:any)=>{
        console.log("Error, could not resolve path to executable to delete it")
      })
    })

    this.child = await command.spawn();

    this.writeInputBuffer();
  }
}