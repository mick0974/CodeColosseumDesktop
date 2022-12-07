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
  public server: string = "";
  public username: string = "";
  

  constructor(
    private readonly connectionManager: ConnectionManagerService,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
  }

  public async connect(): Promise<void> {
    await this.connectionManager.connect(this.server, this.username);

    if (this.connectionManager.isConnected) {
      this.router.navigateByUrl('/home');
    } else {
      // TODO: Show error message
    }
  }
  onClick(){
    if(!this.server){
      alert('Please insert a server url!')
      return;
    }
    if(!this.username){
      alert('Please insert a username!')
      return;
    }
    this.connect();
    //this.newConnection.emit();
    
  }
  get server(){return this.connectForm.get('server')}
  get username(){return this.connectForm.get('username')}
}
