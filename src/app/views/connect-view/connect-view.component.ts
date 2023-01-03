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
  error:boolean = false;
  public connectData:any={};
    
  constructor(
    private readonly connectionManager: ConnectionManagerService,
    private readonly router: Router,
  ) {
    this.error = this.connectionManager.error;
   }

  ngOnInit(): void {
    this.error = this.connectionManager.error;
    console.log('Page reload error = ' + this.error);
  }

  public async connect(): Promise<void> {
    await this.connectionManager.connect(this.connectData.server, this.connectData.username);

    if (this.connectionManager.isConnected && !this.connectionManager.error ) {
      //this.router.navigateByUrl('/home');
    } else {
      // TODO: Show error message
    }

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
    
    if(this.connectData.server && this.connectData.username){
      this.connect();
      return;
    }
    //this.newConnection.emit();
    this.submitted = true;
    
  }
}
