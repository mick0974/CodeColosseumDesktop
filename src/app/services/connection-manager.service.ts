import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, MatchInfo } from './api-service/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionManagerService {
  private _url: string = "ws://127.0.0.1:8088/";
  private _username: string = "Username";

  private api:ApiService= new ApiService();
  
  private _isConnected: boolean = false;
  //deve prenderlo dalla home
  public lobbylistvar?: MatchInfo[];

  constructor(
    private readonly router: Router,
    
  ) { }

  async onApiError(message: string){
    alert("Error: " + message)
  }

  async lobbyList() {
    
    let onSuccess = (gameList:MatchInfo[])=>{ 
      this.lobbylistvar = gameList;
      //let text = JSON.stringify(gameList)
      //console.log("lobbyList: "+text);
      console.log("connectionmanager:")
      console.log(gameList)
    }
    let req = this.api.lobbyList( onSuccess );
    req.onError = this.onApiError;
    console.log(req)
  }

  async lobbyList1(onSuccess:(gameList:MatchInfo[])=>void ) {
    let req = this.api.lobbyList( onSuccess );
    req.onError = this.onApiError;
    console.log(req)
  }

  public get isConnected(): boolean {
    return this._isConnected;
  }

  public get username(): string {
    return this._username;
  }

  public get url(): string {
    return this._url;
  }

  public async connect(url: string, username: string): Promise<boolean> {
    this._url = url;
    this._username = username;
    
    // TODO: connect to server
    // Add the below lines to the connect method
     this._isConnected = true;
     this.router.navigate(['/home']);
     //after the right connection  show the lobby list
     this.lobbyList();
        
    // TO REMOVE: Temporary return true
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this._isConnected = true;
        this.router.navigate(['/home']);
        resolve(true);
      }, 2000);
    });
  }

  public disconnect(): void {
    this._isConnected = false;
    this.router.navigate(['/connect']);
  }

}
