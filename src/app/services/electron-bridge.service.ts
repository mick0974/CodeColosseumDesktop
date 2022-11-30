import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';


const SHELL_EXEC = (<any>window).shell.exec; // from preload.js
const SHELL_STDIN = (<any>window).shell.stdin; // from preload.js



@Injectable({
  providedIn: 'root'
})
export class ElectronBridgeService {
  pipeTest = new Subject<string>();
  

  constructor() { 

  }

  exec(descriptor: ElectronProcessDescriptor):ElectronProcess{
    let process = new ElectronProcess(descriptor);
    process.exec();
    return process;
  }

  /*
  execute(path:string,args:string[], start?:(uid:string)=>void, stdout?:(data:string)=>void, stderr?:(data:string)=>void, exit?:(code:string)=>void){
  
    
    let uid = SHELL_EXEC(path, args, start, stdout, stderr, exit);

    return (data:string)=>{ SHELL_STDIN(uid, data ); }
  }
  */

}



export interface ElectronProcessDescriptor{
  path:string,
  args:string[],
  uid?:string,

  onStart?: (data:string) => void;
  onExit?: (exitCode:string) => void;
  onStdin?: (data:string)=>void;
  onStdout?: (data:string) => void;
  onStderr?: (data:string) => void;
}

export class ElectronProcess{
  descriptor: ElectronProcessDescriptor
  isRunning = false
  isExit = false
  exitCode?:string;

  stdin?:(data:string)=>void

  constructor(descriptor:ElectronProcessDescriptor){
    this.descriptor = descriptor;
  }

  exec(){
    let onExit = (exitCode:string)=>{ 
      if(!this.isRunning){return;}
      this.isRunning = false; 
      this.isExit = true; 
      this.exitCode = exitCode;
      if(this.descriptor.onExit){ this.descriptor.onExit(exitCode)};
    }
    this.descriptor.uid = SHELL_EXEC(
      this.descriptor.path, 
      this.descriptor.args,
      this.descriptor.onStart,
      this.descriptor.onStdout,
      this.descriptor.onStderr,
      onExit
    );
    this.stdin = (data:string) => { 
      if(!this.isRunning){return;}
      if (this.descriptor.onStdin){this.descriptor.onStdin(data)}; 
      SHELL_STDIN(this.descriptor.uid, data) 
    };
    this.isRunning = true;
  }

  write(data:string){
    if(this.stdin){this.stdin(data);}
  }
}