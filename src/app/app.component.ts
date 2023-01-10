import { Component, OnInit } from '@angular/core';
import { ConnectionManagerService } from './services/connection-manager.service';
import { RippleModule } from 'primeng/ripple';
import { PrimeNGConfig } from 'primeng/api';
import { AppTheme, ThemeService } from './services/theme-service/theme.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title: string = 'Code Colosseum';
  path: string = "../assets/images/colosseum-72.png";
  alttext: string = "code colossem image";

  constructor(
    private readonly connectionManager: ConnectionManagerService,
    private readonly primengConfig: PrimeNGConfig,
    private readonly themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  public get changeThemIcon(): string {
    return this.themeService.currentTheme == AppTheme.dark ? 'pi-sun' : 'pi-moon';
  }

  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }

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
