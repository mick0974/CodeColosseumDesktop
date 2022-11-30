import { Component, OnInit, NgZone } from '@angular/core';
import { ElectronBridgeService, ElectronProcess, ElectronProcessDescriptor } from 'src/app/services/electron-bridge.service';


@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnInit {
  process?:ElectronProcess;
  output = "";
  
  constructor(
    private electronBridgeSrv: ElectronBridgeService,
    public zone:NgZone  
  ) { 
    
  }

  ngOnInit(): void {
  }


  actionRock(){
    this.process?.write("ROCK\n") ;
  }
  actionPaper(){
    this.process?.write("PAPER\n") ;
  }
  actionScissor(){
    this.process?.write("SCISSOR\n");
  }

  public refreshOutput() {
    this.zone.run(() => this.output += "")
  }



  actionExec(){
    let descriptor = {
      path: "./data/rock-paper-scissor",
      args: ["3","1"],
      onStart: (proc_uid:string)=>{
        this.output = "";
        this.refreshOutput();
      },
      onStdout: (data:string)=>{
        this.output += " OUT: "+ data
        console.log("OUT: "+data);
        this.refreshOutput();
      },
      onStdin: (data:string)=>{
        this.output += " IN: "+ data;
        console.log("IN: "+data);
        this.refreshOutput();
      },
    };

    this.process = this.electronBridgeSrv.exec(descriptor);
  }

  actionCompile(){
    
    let descriptor = {
      path: "./data/rock-paper-scissor.sh",
      args: [],
      onStart: (proc_uid:string)=>{
        this.output = "actionCompile:\n";
        console.log("actionCompile:\n");
        this.refreshOutput();
      },
      onStdout: (data:string)=>{
        this.output += " OUT: "+ data
        console.log("OUT: "+data);
        this.refreshOutput();
      }
    };

    this.process = this.electronBridgeSrv.exec(descriptor);
  }
}

