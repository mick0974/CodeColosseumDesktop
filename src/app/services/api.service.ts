import { Injectable } from '@angular/core';
import { Packets } from './components/packets';
import { Commands } from './components/commands';
import { CoCoSockets } from './components/socket';

@Injectable({
  providedIn: 'root'
})

export class MatchInfo extends Packets.MatchInfo{}
export class RoshamboArgs extends Packets.RoshamboArgs {}
export class RoyalurArgs extends Packets.RoyalurArgs {}


export class ApiService {
  public url = 'ws://localhost:8088';
  public ws?:CoCoSockets.CoCoSocket;

  private createCoCosocket(url:string) {
    this.ws = new CoCoSockets.CoCoSocket(url);
  }

  public gameList(
    gameListed?:(gameList:String[])=>void, 
    webSocketError?:(error: String)=>void){
    
    this.createCoCosocket(this.url);
    
    let cmdGameList = new Commands.GameList(this.ws!);
    cmdGameList.gameListed = (message)=>{
      if(gameListed) {gameListed(message.games);}
    }

    cmdGameList.webSocketError = webSocketError;
    cmdGameList.run();
    return cmdGameList;
  }

  public gameDescription(
    game:string,
    gameDescripted?:(gameDescription?:string)=>void, 
    webSocketError?:(error: String)=>void){
    
    this.createCoCosocket(this.url);

    let cmdGameList = new Commands.GameDescription(this.ws!, game);
    cmdGameList.gameDescripted = (message)=>{
      if(gameDescripted){gameDescripted(message.description)}
    }
    
    cmdGameList.webSocketError = webSocketError;
    cmdGameList.run();
    
    return cmdGameList;
  }

  public lobbyList( 
    lobbyListed?:(lobbyList:MatchInfo[])=>void, 
    webSocketError?:(error:String)=>void ){
    
    this.createCoCosocket(this.url);
    
    let cmdLobbyList = new Commands.LobbyList(this.ws!);
    cmdLobbyList.lobbyListReceived = (message)=>{
      if(lobbyListed){lobbyListed(message.info)}
    }
    cmdLobbyList.webSocketError = webSocketError;
    cmdLobbyList.run();
    return cmdLobbyList;
  }

  public createNewGame( 
    lobby_name:string, 
    game_name:string, 
    players?:number, 
    bots?:number, 
    timeout?:number, 
    args?:any, 
    password?:string, 
    verification?:string,
    lobbyCreated?:(newGame:string) =>void,  
    apiError?:(error:string)=>void,
    webSocketError?:(error:string)=>void ){

    this.createCoCosocket(this.url);
    
    let cmdNewGame = new Commands.CreateNewLobby(this.ws!, lobby_name, game_name, players, bots, timeout, args, password, verification);
    cmdNewGame.newLobbyCreated = (message)=>{
      if(message.id["Err"] != undefined){
        if(apiError){apiError(message.id["Err"]);}
      }
      else{
          if(lobbyCreated){lobbyCreated(message.id["Ok"])}
      }
    }

    cmdNewGame.webSocketError = webSocketError;
    cmdNewGame.run();
    return cmdNewGame;
  }

  public connectToPlay( 
    lobby_id:string, player_name:string, password?:string,
    lobbyJoined?:(message:MatchInfo) => void, 
    lobbyUpdated?:(message:MatchInfo) => void,
    matchStarted?:() => void,
    binaryMessage?:(message:string) => void,
    matchEnded?:() => void,
    apiError?:(error:string) => void, 
    webSocketError?:(error:string)=>void){
    
    this.createCoCosocket(this.url);
    
    let cmdConnect = new Commands.Connect(this.ws!, lobby_id, player_name, password);
    cmdConnect.lobbyJoined = (message) => {
      if(lobbyJoined) {lobbyJoined(message)}
    }
    cmdConnect.lobbyUpdated = (message) => {
      if(lobbyUpdated) {lobbyUpdated(message)}
    }
    cmdConnect.matchStarted = () => {
      if(matchStarted) {matchStarted()}
    }
    cmdConnect.binaryInfo = (message) => { 
      if(binaryMessage) {binaryMessage(message)}
    }
    cmdConnect.matchEnded = () => { 
      if(matchEnded) {matchEnded()}
    }
    cmdConnect.apiError = (message) => { 
      if(apiError) {apiError(message)}
    }

    cmdConnect.webSocketError = webSocketError;
    cmdConnect.run();

    return cmdConnect;
  }

  public play(inputString:string) {
    let cmdPlay = new Commands.Play(this.ws!, inputString);
    
    cmdPlay.run();

    return cmdPlay;
  }

  public connectToSpectate( 
    lobby_id:string,
    spectateJoined?:(message:MatchInfo )=>void,
    spectateStarted?:()=>void,
    spectatSynced?:()=>void,
    lobbyUpdated?:(message:MatchInfo)=>void,
    binaryMessage?: (message:string) => void,
    spectateEnded?:()=>void,
    apiError?:(error:string) => void,
    webSocketError?:(error:string)=>void){
    
    this.createCoCosocket(this.url);
    
    let cmdSpectate = new Commands.Spectate(this.ws!, lobby_id);
    cmdSpectate.spectateJoined = (message) => {
      if(spectateJoined) {spectateJoined(message)}
    }
    cmdSpectate.spectateStarted = () => {
      if(spectateStarted) {spectateStarted()}
    }
    cmdSpectate.spectatSynced = () => {
      if(spectatSynced) {spectatSynced()}
    }
    cmdSpectate.lobbyUpdated = (message) => { 
      if(lobbyUpdated) {lobbyUpdated(message)}
    }
    cmdSpectate.binaryMessage = (message) => { 
      if(binaryMessage) {binaryMessage(message)}
    }
    cmdSpectate.spectateEnded = () => { 
      if(spectateEnded) {spectateEnded()}
    }
    cmdSpectate.apiError = (message) => { 
      if(apiError) {apiError(message)}
    }

    cmdSpectate.webSocketError = webSocketError;
    cmdSpectate.run();

    return cmdSpectate;
  }
}
