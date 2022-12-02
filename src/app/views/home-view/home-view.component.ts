import { Component, OnInit, NgZone } from '@angular/core';
// import { ElectronBridgeService, ElectronProcess, ElectronProcessDescriptor } from 'src/app/services/electron-bridge.service';
import { Child, Command, open as ShellOpen } from '@tauri-apps/api/shell'

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnInit {
  child: Child | undefined;
  // process?:ElectronProcess;
  // output = "";

  constructor(
    // private electronBridgeSrv: ElectronBridgeService,
    public zone: NgZone
  ) {

  }

  async ngOnInit(): Promise<void> {
    console.log("creating command");
    const command = new Command('sh', ['-c','../data/rock-paper-scissor 3 1']);
    command.on('error', (error: any) => console.error(`command error: "${error}"`));
    command.stdout.on('data', (line: any) => console.log(`command stdout: "${line}"`));
    command.stderr.on('data', (line: any) => console.log(`command stderr: "${line}"`));
    console.log("spawning command");
    this.child = await command.spawn();
  }


  actionRock(){
    console.log(this.child);
    this.child?.write("ROCK\n") ;
  }
  actionPaper(){
    this.child?.write("PAPER\n") ;
  }
  actionScissor(){
    this.child?.write("SCISSOR\n");
  }

  // public refreshOutput() {
  //   this.zone.run(() => this.output += "")
  // }



  // actionExec(){
  //   let descriptor = {
  //     path: "./data/rock-paper-scissor",
  //     args: ["3","1"],
  //     onStart: (proc_uid:string)=>{
  //       this.output = "";
  //       this.refreshOutput();
  //     },
  //     onStdout: (data:string)=>{
  //       this.output += " OUT: "+ data
  //       console.log("OUT: "+data);
  //       this.refreshOutput();
  //     },
  //     onStdin: (data:string)=>{
  //       this.output += " IN: "+ data;
  //       console.log("IN: "+data);
  //       this.refreshOutput();
  //     },
  //   };

  //   this.process = this.electronBridgeSrv.exec(descriptor);
  // }

  // actionCompile(){

  //   let descriptor = {
  //     path: "./data/rock-paper-scissor.sh",
  //     onStart: (proc_uid:string)=>{
  //       this.output = "actionCompile:\n";
  //       console.log("actionCompile:\n");
  //       this.refreshOutput();
  //     },
  //     onStdout: (data:string)=>{
  //       this.output += " OUT: "+ data
  //       console.log("OUT: "+data);
  //       this.refreshOutput();
  //     }
  //   };

  //   this.process = this.electronBridgeSrv.exec(descriptor);
  // }
}

