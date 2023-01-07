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
  private api:ApiService= new ApiService();
  //deve prenderlo dalla createNewMatch
  public lobbyIdvar?: string;
  public gameDetailsvar: GameDetails = {};
  public gameListvar?:string[];

  constructor(private router:Router,private connectionManager:ConnectionManagerService) { 
    this.onApiError = this.onApiError.bind(this)

  }

  async setGame1(token:string|null):Promise<void>{
    return new Promise<void>(
      (resolve, reject) => {
        if (token){
          //Check: does the game exist? If so, save it
          let onSuccess = (gameList:MatchInfo[])=>{
            this.validLobbies = gameList;
            console.log(gameList)
            this.validLobbies.find( (g) => (this.game = g.id === token ? g : null) )  //Check if this ID exists, if so saves game in this.game
          
            if(this.game){
              console.log("[Service] Game set to "+ this.game.id)
              console.log(this.game)
            }
            else{
              console.log("[Service] Attempted to edit game that doesn't exist!")
            }
            resolve();
          }
    
          this.connectionManager.lobbyList1(onSuccess)
        }
        else {
          // No ID was given: redirect
          console.log("[Service] No ID found; gotta redirect...")
        }
      })
  }


  getGameId():string{
    if (this.game){
      return this.game.id
    }
    else return ""
  }
  getGameName():string{
    if (this.game){
      return this.game.name
    }
    else return ""
  }

  getGame():MatchInfo | null{
    if (this.game){
      return this.game;
    }
    else return null
  }

  isGameSet(){
    if (this.game){
      return true
    }
    return false
  }
  
  redirectIfGameNotSet(){
    if(!this.isGameSet()){
      console.log("[Upload] Game was not set; redirect to home...")
      //this.router.navigate(['home'])
    }
  }
  
  reset(){
    this.game=null;
    console.log("[Service] Gameplay was reset.")
  }
  
  async onApiError(message: string){
    //alert("Error: "+ message)
    this.connectionManager.onApiError(message);
  }

  //idea for every member of game list I will show its description
  async getGameDescription(token:string|null){

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

