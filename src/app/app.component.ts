import { Component } from '@angular/core';
import { ConnectionManagerService } from './services/connection-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private readonly connectionManager: ConnectionManagerService,
  ) { }

  public get isConnected(): boolean {
    return this.connectionManager.isConnected;
  }

  public get username(): string {
    return this.connectionManager.username;
  }

  public get serverUrl(): string {
    return this.connectionManager.url;
  }

  public async disconnect(): Promise<void> {
    this.connectionManager.disconnect();
  }
}
