import { Injectable } from '@angular/core';
import { ApiService, GameDetails, MatchInfo } from './api-service/api.service';
import { Router } from '@angular/router';
import { ConnectionManagerService } from './connection-manager.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  game! : MatchInfo | null;
  validLobbies:MatchInfo[]=[];
  private api:ApiService= new ApiService(this.connectionManager);
  //deve prenderlo dalla createNewMatch
  public lobbyIdvar?: string;
  public gameDetailsvar: GameDetails = {};
  public gameListvar?:string[];

  constructor(private router:Router,private connectionManager:ConnectionManagerService) { 
    this.onApiError = this.onApiError.bind(this)

  }



  isGameSet(){
    if (this.game){
      return true
    }
    return false
  }

  reset(){
    this.game=null;
    console.log("[Service] Gameplay was reset.")
  }
  
  async onApiError(message: string){
    this.connectionManager.onApiError(message);
  }


  
  async apiGameList() {
    let onSuccess = (gameList:string[])=>{ 
      this.gameListvar = gameList;
      console.log("gameList: ");
      console.log(this.gameDetailsvar);
    }
    let req = this.api.gameList( onSuccess );
    req.onError = this.onApiError;
    console.log(req);
  }

  async apiGameList1(onSuccess:(gameNameList:string[])=>void)
    {
      let req = this.api.gameList( onSuccess );
      req.onError = this.onApiError;
      console.log(req);
    }

  async apiGameDescription(gameName:string) {
    let onSuccess = (gameDescription:string)=>{ 
      let text = JSON.stringify(gameDescription)
      console.log("gameDescription: ");
      console.log(text);
    }
    //here we have to substitute "roshambo" and "royalur" with elements 
    let req = this.api.gameDescription( gameName, onSuccess );
    //let req1 = this.api.gameDescription( "roshambo", onSuccess);
    req.onError = this.onApiError;
    //req1.onError = this.onApiError;
  }
  async apiGameDescription1(gameName:string, onSuccess:(gameDescription:string)=> void) {
    //here we have to substitute "roshambo" and "royalur" with elements 
    let req = this.api.gameDescription( gameName, onSuccess );
    //let req1 = this.api.gameDescription( "roshambo", onSuccess);
    req.onError = this.onApiError;
    //req1.onError = this.onApiError;
  }
  
  /*async gameDetailsList(onSuccess:(gameDescr:GameDescription)=>void ) {
    let req = this.api.lobbyList( onSuccess );
    req.onError = this.onApiError;
    console.log(req)
  }*/

  /*
  async createNewLobby(gameDet:GameDetails, onSuccess:(newgame:string)=>void){
    let req = this.api.createNewLobby( onSuccess, gameDet);
    req.onError = this.onApiError;
    console.log(req)
  }*/
  /*async apiNewGame() {
    let onSuccess = (newGame:string)=>{
      let text = newGame
      this.output = text
      console.log("newGame: "+text);
      this.lobbyID = newGame;
    let req = this.api.createNewLobby(onSuccess,"new_lobby","roshambo", 2, 0);
    req.onError = this.onApiError;
  }*/
}

