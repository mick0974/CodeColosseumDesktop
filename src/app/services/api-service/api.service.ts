import { Injectable } from '@angular/core';
import { Packets } from './api.packets';
import { Commands } from './api.commands';
import { CoCoSocket } from './api.socket';


export interface GameParams extends Packets.GameParams{}
export interface MatchInfo extends Packets.MatchInfo{}
export class Args{
  public name:string;
  public value:string;

  constructor(name:string, value:string){
    this.name = name;
    this.value = value;
  }
}
export class GameDescription {
  public game_name: string;
  public game_descr:string;

  constructor(game_name:string, game_descr:string) {
    this.game_name = game_name;
    this.game_descr = game_descr;
  }
}

export class GameDetails{
  public lobby_name?:string;
  public password?:string;
  public game_description?:GameDescription;
  public game_params?:GameParams;
  public args?:Args[];

  constructor(lobby_name:string, password:string, game_description?:GameDescription, game_params?:GameParams, args?:Args[]){
    this.lobby_name = lobby_name;
    this.password = password;
    this.game_description = game_description;
    this.game_params = game_params;
    this.args = args;
  }
}

export enum LobbyEventType{ 
  Join = 'LobbyJoin', 
  Start = 'LobbyStart', 
  End = 'LobbyEnd', 
  Sync = 'LobbySync'
}

export enum ErrorType{ 
  LobbyJoinFailed = 'LobbyJoinFailed',
  LobbyCreateFailed = 'LobbyCeateFailed'
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
      gameDetails:GameDetails
      /*
      lobby_name:string, 
      game_name:string, 
      players?:number,
      bots?:number,
      timeout?:number,
      args?:{}, //new RoshamboArgs || new RoyalurArgs
      password?:string
      */
    ){
      let gameArgs;
      if(gameDetails.args!.length > 1) { 
        gameArgs = new Packets.RoshamboArgs(gameDetails.args![0].value, gameDetails.args![1].value);
      }
      else if(gameDetails.args!.length === 1){
        gameArgs = new Packets.RoyalurArgs(gameDetails.args![0].value);
      }

      let cmdNewGame = new Commands.NewLobby(this.url, gameDetails.lobby_name, gameDetails.game_description!.game_name, gameDetails.game_params!.players, gameDetails.game_params!.bots, gameDetails.game_params!.timeout, gameArgs, gameDetails.password);
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
      onError?:(data:string)=>void
    ){
    
    let cmdConnect = new Commands.Connect(this.url, lobbyID, displayName, password);
    cmdConnect.onReciveJoin = (message) => { 
      console.log(message.info.Err)
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
    cmdConnect.onError = onError
    
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
