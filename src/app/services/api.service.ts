import { Injectable } from '@angular/core';
import { Packets } from './components/packets';
import { Commands } from './components/commands';
import { CoCoSockets } from './components/socket';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  public url = 'ws://localhost:8088';
  public ws?:CoCoSockets.CoCoSocket;
  
  private createCoCosocket(url:string) {
    this.ws = new CoCoSockets.CoCoSocket(url);
  }

  public gameList(result:(gameList:String[])=>void, error?:(error: String)=>void){
    this.createCoCosocket(this.url);
    
    let cmdGameList = new Commands.GameList(this.ws!);
    cmdGameList.gameListReceived = (message)=>{
      if(result){result(message.games)}
    }
    cmdGameList.resultError = error;
    cmdGameList.run();
    return cmdGameList;
  }

  public lobbyList( result:(lobbyList:Packets.MatchInfo[])=>void, error?:(error:String)=>void ){
    this.createCoCosocket(this.url);
    
    let cmdLobbyList = new Commands.LobbyList(this.ws!);
    cmdLobbyList.lobbyListReceived = (message)=>{
      if(result){result(message.info)}
    }
    cmdLobbyList.resultError = error;
    cmdLobbyList.run();
    return cmdLobbyList;
  }

  public createNewGame( result:(newGame:string) =>void, lobby_name:string, game_name:string, players?:number, bots?:number, timeout?:number, args?:{}, password?:string, verification?:string, error?:(error:string)=>void){
    this.createCoCosocket(this.url);
    
    let cmdNewGame = new Commands.CreateNewLobby(this.ws!, lobby_name, game_name, players, bots, timeout, args, password, verification);
    cmdNewGame.newLobbyCreated = (message)=>{
      if(result){
        if(message.id["Err"] != undefined){
          if(cmdNewGame.resultError){
            cmdNewGame.resultError(message.id["Err"]);
          }
        }
        else{
          result(message.id["Ok"])
        }
      }
    }

    cmdNewGame.resultError = error;
    cmdNewGame.run();
    return cmdNewGame;
  }

  public connectToPlay( 
    lobbyJoined:(message:Packets.Reply.LobbyJoinedMatch) => void, 
    lobbyUpdated:(message:Packets.Reply.LobbyUpdate) => void,
    matchStarted:(message:Packets.Reply.MatchStarted) => void,
    binaryMessage:(message:string) => void,
    matchEnded:(message:Packets.Reply.MatchEnded) => void,
    lobby_id:string, lobby_name:string, password?:string, 
    error?:(error:string)=>void){
    
    this.createCoCosocket(this.url);
    
    let cmdConnect = new Commands.Connect(this.ws!, lobby_id, lobby_name, password);
    cmdConnect.lobbyJoined = (message) => {
      if(lobbyJoined) {lobbyJoined(message)}
    }
    cmdConnect.lobbyUpdated = (message) => {
      if(lobbyUpdated) {lobbyUpdated(message)}
    }
    cmdConnect.matchStarted = (message) => {
      if(matchStarted) {matchStarted(message)}
    }
    cmdConnect.binaryInfo = (message) => { 
      if(binaryMessage) {binaryMessage(message)}
    }
    cmdConnect.matchEnded = (message) => { 
      if(matchEnded) {matchEnded(message)}
    }

    cmdConnect.resultError = error;
    cmdConnect.run();

    return cmdConnect;
  }

  public play(inputString:string) {
    let cmdPlay = new Commands.Play(this.ws!, inputString);
    
    cmdPlay.run();

    return cmdPlay;
  }

  public connectToSpectate( 
    spectateJoined:(message:Packets.Reply.SpectateJoined )=>void,
    spectateStarted:(message:Packets.Reply.SpectateStarted)=>void,
    spectatSynced:(message:Packets.Reply.SpectateSynced)=>void,
    lobbyUpdated:(message:Packets.Reply.LobbyUpdate)=>void,
    binaryMessage: (message:string) => void,
    spectateEnded:(message:Packets.Reply.SpectateEnded)=>void,
    lobby_id:string, 
    error?:(error:string)=>void){
    
    this.createCoCosocket(this.url);
    
    let cmdSpectate = new Commands.Spectate(this.ws!, lobby_id);
    cmdSpectate.spectateJoined = (message) => {
      if(spectateJoined) {spectateJoined(message)}
    }
    cmdSpectate.spectateStarted = (message) => {
      if(spectateStarted) {spectateStarted(message)}
    }
    cmdSpectate.spectatSynced = (message) => {
      if(spectatSynced) {spectatSynced(message)}
    }
    cmdSpectate.lobbyUpdated = (message) => { 
      if(lobbyUpdated) {lobbyUpdated(message)}
    }
    cmdSpectate.binaryMessage = (message) => { 
      if(binaryMessage) {binaryMessage(message)}
    }
    cmdSpectate.spectateEnded = (message) => { 
      if(spectateEnded) {spectateEnded(message)}
    }

    cmdSpectate.resultError = error;
    cmdSpectate.run();

    return cmdSpectate;
  }
}
