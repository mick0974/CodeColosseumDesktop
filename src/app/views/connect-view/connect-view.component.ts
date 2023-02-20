import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionManagerService } from '../../services/connection-manager.service';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-connect-view',
  templateUrl: './connect-view.component.html',
  styleUrls: ['./connect-view.component.scss']
})
export class ConnectViewComponent implements OnInit {
  //@Output() newConnection = new EventEmitter()
  //public server: string = "";
  //public username: string = "";
  
  submitted: boolean = false;
  waiting:boolean = false;
  error:boolean = false;
  error_msg:string = "";
  public connectData:any={};
    
  constructor(
    private readonly connectionManager: ConnectionManagerService,
    private readonly router: Router,
  ) {
    this.error = this.connectionManager.error;
    if(this.error)
      this.error_msg = "Unable to connect to the server. The server address may be incorrect or the server may be offline.";
    
   }

  ngOnInit(): void {
    this.connectData.server = "ws://localhost:8088"
    this.error = this.connectionManager.error;
    if(this.error)
      this.error_msg = "Unable to connect to the server. The server address may be incorrect or the server may be offline.";
    
    console.log('Page reload error = ' + this.error);
  }

  public async connect(): Promise<void> {
    await this.connectionManager.connect(this.connectData.server, this.connectData.username);
  }
  serverChange(event: any){
    //console.log(event);
    //console.log(this.connectData);
  }
  usernameChange(event: any){
    //console.log(event);
    //console.log(this.connectData);
  }
  onClick(){
    
    let valid = true;
    try {
      let url = new URL(this.connectData.server);
      valid = url.protocol == 'ws:' || url.protocol == 'wss:';
    } catch (_) {
      valid = false
    }
    if(!valid){
      this.error = true
      this.error_msg = "Server name not valid."
      return
    }
    

    if(this.connectData.server && this.connectData.username && this.connectData.username.length<=25){
      this.error = false;
      this.waiting = true;
      this.connect();
      return;
    }
    //this.newConnection.emit();
    this.submitted = true;
    
  }

  onEnter(event:any){
    if(event.keyCode === 13){
      this.onClick();
    }
  }
}
