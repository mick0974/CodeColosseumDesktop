import { Injectable, OnInit } from "@angular/core";
import { Child, Command, open as ShellOpen } from '@tauri-apps/api/shell';
import { resolve } from "dns";
import { timeout } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TauriService {
  public child: Child | undefined;
  public filename: string = "../data/rock-paper-scissor";

  constructor(){}

  async sendToProcess(message: string){
    this.wait().then((value) => {
      if(!message.endsWith("\n")){
        message += "\n";
      }
  
      console.log("Sending to Tauri: " + message + ", process " + this.child?.pid);
  
      this.child?.write(message).then((value) => {
        console.log("Write to Tauri of {" + message + "} successful");
      }, (reason) => {
        console.log("Write to Tauri failed: " + reason);
      });
    });
  }

  async execProgram(
    filename: string,
    onProcessStdOut: (output:string)=>void,
    onProcessStdErr?: (error:string)=>void,
    ...args: string[]){

    //this.filename = "../data/rock-paper-scissor";

    const command = new Command("sh", ["-c", `${this.filename} ${args.join(" ")}`]);

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

    this.child = await command.spawn();
    console.log("pid: " + this.child.pid);
  }

  wait(){
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
}