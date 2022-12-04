import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionManagerService } from 'src/app/services/connection-manager.service';

@Component({
  selector: 'app-connect-view',
  templateUrl: './connect-view.component.html',
  styleUrls: ['./connect-view.component.scss']
})
export class ConnectViewComponent implements OnInit {

  public server: string = "";
  public username: string = "";
  public password: string = "";

  constructor(
    private readonly connectionManager: ConnectionManagerService,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
  }

  public async connect(): Promise<void> {
    await this.connectionManager.connect(this.server, this.username, this.password);

    if (this.connectionManager.isConnected) {
      this.router.navigateByUrl('/home');
    } else {
      // TODO: Show error message
    }
  }

}
