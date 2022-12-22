import { Injectable } from '@angular/core';
import { Packets } from './api.packets';
import { Commands } from './api.commands';
import { CoCoSocket } from './api.socket';


export interface GameParams extends Packets.GameParams{}
//export class GameDescription extends Packets.Message.GameDescription{}
export interface MatchInfo extends Packets.MatchInfo{}
export interface RoshamboArgs extends Packets.RoshamboArgs {}
export interface RoyalurArgs extends Packets.RoyalurArgs {}
//export interface GameDetails extends Packets.GameDetails{}
export enum LobbyEventType{ 
  Join = 'LobbyJoin', 
  Start = 'LobbyStart', 
  End = 'LobbyEnd', 
  Sync = 'LobbySync'
}

export enum ErrorType{ 
  LobbyJoinFailed = 'LobbyJoinFailed',
  LobbyCreateFailed = 'LobbyCreateFailed'
}



@Injectable({
  providedIn: 'root'
})

export class ApiService {
  public url = 'ws://localhost:8088';
  public ws?:CoCoSocket;

  constructor(){

  }
  
  private createCoCosocket(url:string) {
    this.ws = new CoCoSocket(url);
  }

  public gameList(onResult:(gameList:string[])=>void){
    
    let cmdGameList = new Commands.GameList(this.url);
    cmdGameList.onRecieveGameList = (message)=>{
      if(onResult){onResult(message.games)}
    }
    cmdGameList.run();
    return cmdGameList;
  }

  public lobbyList( onData:(lobbyList:MatchInfo[])=>void ){
    let cmdLobbyList = new Commands.LobbyList(this.url);
    cmdLobbyList.onReciveLobbyList = (message)=>{
      if(onData){onData(message.info)}
    }
    cmdLobbyList.run();
    return cmdLobbyList;
  }

  public gameDescription(
    game:string,
    onData:(gameDescription:string)=>void) {
    
    let cmdGameList = new Commands.GameDescription(this.url, game);
    cmdGameList.onRecieveGameDescription = (message)=>{
      if(onData){onData(message.description)}
    }    
    cmdGameList.run();
    return cmdGameList;
  }

  public createNewLobby( 
      onData:(newGame:string)=>void, 
      lobby_name:string, 
      game_name:string, 
      players?:number,
      bots?:number,
      timeout?:number,
      args?:{}, //new RoshamboArgs || new RoyalurArgs
      password?:string
    ){
      let cmdNewGame = new Commands.NewLobby(this.url, lobby_name, game_name, players, bots, timeout, args, password);
      cmdNewGame.onReciveNewLobby = (message)=>{
        if(onData){
          if(message.id["Err"] != undefined){
            if(cmdNewGame.onError){
              cmdNewGame.onError(message.id["Err"]);
            }
          }
          else{
            onData(message.id["Ok"])
          }
        }
      }
      cmdNewGame.run();
      return cmdNewGame;
  }

  public connectToPlay( 
      lobbyID:string, 
      displayName:string, 
      password?:string,
      onEvent?: (state:LobbyEventType)=>void,
      onMatchUpdate?: (matchInfo: MatchInfo)=>void, 
      onData?: (data:string)=>void,
    ){
    
    let cmdConnect = new Commands.Connect(this.url, lobbyID, displayName, password);
    
    cmdConnect.onReciveJoin = (message) => { 
      if (message.info.Err){ 
        if (cmdConnect.onError) { cmdConnect.onError("Failed to join lobby: "+message.info.Err)  } 
        return;
      }
      if(onEvent) { onEvent(LobbyEventType.Join) } 
      if(onMatchUpdate && message.info.Ok) { onMatchUpdate(message.info.Ok) }
    }
    cmdConnect.onReciveStart = (message) => { if(onEvent) { onEvent(LobbyEventType.Start) } }
    cmdConnect.onReciveEnd = (message) => { if(onEvent) { onEvent(LobbyEventType.End) } }
    cmdConnect.onReciveUpdate = (message) => { if(onMatchUpdate ) { onMatchUpdate(message.info) } }
    cmdConnect.onReciveBinary = (message) => { if(onData) { onData(message)} }
    
    cmdConnect.run();
    return cmdConnect;
  }

  public connectToSpectate( 
      lobbyID:string, 
      onEvent?: (state:LobbyEventType)=>void,
      onMatchUpdate?: (matchInfo: MatchInfo)=>void, 
      onData?: (data:string)=>void,
    ){
    
    let cmdSpectate = new Commands.Spectate(this.url, lobbyID);

    cmdSpectate.onReciveJoin = (message) => { 
      if (message.info.Err){ 
        if (cmdSpectate.onError) { cmdSpectate.onError("Failed to join lobby: "+message.info.Err)  } 
        return;
      }
      if(onEvent) { onEvent(LobbyEventType.Join) } 
      if(onMatchUpdate && message.info.Ok) { onMatchUpdate(message.info.Ok) }
    }
    cmdSpectate.onReciveStart = () => { if(onEvent) { onEvent(LobbyEventType.Start) } }
    cmdSpectate.onReciveEnd = () => { if(onEvent) { onEvent(LobbyEventType.End) } }
    cmdSpectate.onReciveSync = () => { if(onEvent) { onEvent(LobbyEventType.Sync) } }
    cmdSpectate.onReciveUpdate = (message) => { if(onMatchUpdate) { onMatchUpdate(message.info) } }
    cmdSpectate.onReciveBinary = (message) => { if(onData) { onData( message )} }
    
    cmdSpectate.run();
    return cmdSpectate;
  }
}
