import { Injectable } from '@angular/core';
import { Packets } from './components/packets';
import { Commands } from './components/commands';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  public url = 'ws://localhost:8088';

  public gameList(result:(gameList:String[])=>void, error?:(error: String)=>void){
    let cmdGameList = new Commands.GameList(this.url);
    cmdGameList.gameListReceived = (message)=>{
      if(result){result(message.games)}
    }
    cmdGameList.resultError = error;
    cmdGameList.run();
    return cmdGameList;
  }

  public lobbyList( result:(lobbyList:Packets.MatchInfo[])=>void, error?:(error:String)=>void ){
    let cmdLobbyList = new Commands.LobbyList(this.url);
    cmdLobbyList.lobbyListReceived = (message)=>{
      if(result){result(message.info)}
    }
    cmdLobbyList.resultError = error;
    cmdLobbyList.run();
    return cmdLobbyList;
  }

  public createNewGame( result:(newGame:string) =>void, lobby_name:string, game_name:string, players?:number, bots?:number, timeout?:number, args?:{}, password?:string, verification?:string, error?:(error:string)=>void){
    let cmdNewGame = new Commands.CreateNewLobby(this.url, lobby_name, game_name, players, bots, timeout, args, password, verification);
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

  public connect( result:(lobbyData:Packets.Reply.LobbyJoinedMatch) => void, 
  result2:(lobbyData:Packets.Reply.LobbyUpdate) => void,
  result3:(lobbyData:Packets.Reply.MatchStarted) => void,
  result4:(message:string) => void,
  lobby_id:string, lobby_name:string, password?:string, error?:(error:string)=>void){
    
    let cmdConnect = new Commands.Connect(this.url, lobby_id, lobby_name, password);
    
    cmdConnect.lobbyJoined = (message) => {
      if(result) {result(message)}
    }
    cmdConnect.lobbyUpdated = (message) => {
      if(result2) {result2(message)}
    }
    cmdConnect.matchStarted = (message) => {
      if(result3) {result3(message)}
    }
    cmdConnect.binaryInfo = (message) => { 
      if(result4) {result4(message)}
    }

    cmdConnect.resultError = error;
    cmdConnect.run();

    return cmdConnect;
  }

  public play(inputString:string) {
    console.log("start play");
    let cmdPlay = new Commands.Play(this.url, inputString);
    cmdPlay.run();

    return cmdPlay;
  }
}
