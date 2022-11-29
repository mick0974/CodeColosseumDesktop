import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';

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
  lobby_id:string, lobby_name:string, password?:string, error?:(error:string)=>void){
    
    let cmdConnect = new Commands.Connect(this.url, lobby_id, lobby_name, password);
    
    cmdConnect.lobbyJoined = (message) => {
      if(result) {result(message)}
    }
    cmdConnect.lobbyUpdated = (message) => {
      if(result2) {result2(message)}
    }
    cmdConnect.resultError = error;
    cmdConnect.run();
    return cmdConnect;
  }
}

export class CoCoSocket{
  public url = 'ws://localhost:8088';
  public ws?:WebSocketSubject<string>;
  public resultError?:(error:string)=>void;
  public resultClosed?:()=>void;
  
  constructor(url:string){
    this.url = url;
  }

  public connect():boolean{

    if (!this.ws || this.ws.closed ){
      this.ws = new WebSocketSubject(this.url);
    }
    
    this.ws.subscribe({
      error: (err) => { // Called whenever there is a message from the server.
        let errorMsg = JSON.stringify(err);
        if (this.resultError) {this.resultError(errorMsg );}
      },
      complete: () => {
        if (this.resultClosed) {this.resultClosed();}
      }
    });
    
    return !this.ws.closed;
  }
  
  public send<T extends Packets.Reply.Message>(
    request:Packets.Request.Message, 
    reply: new ()=>T, 
    recieved?:(message:T)=>void){
      
    if (this.ws == null) {return false}
    
    /*
    let messageType = request.messageName()
    let messageObserver = this.ws.multiplex(
      ()=>({subscribe: messageType}),
      ()=>({unsubscribe: messageType}),
      (message:any) => message.type === messageType
    )
    */

    this.ws.subscribe({
      next: (payload) => { // Called whenever there is a message from the server.
        let msg = new reply();
        let success = msg.fromPacket(payload);
        if (success && recieved){ recieved(msg); }
      } 
    });


    let packet = request.toPacket();
    this.ws.next(packet);

    return this.ws;
  }
}

export class MultiTypeCoCoSocket{
  public url = 'ws://localhost:8088';
  public ws?:WebSocketSubject<string>;
  public resultError?:(error:string)=>void;
  public resultClosed?:()=>void;

  public msgClasses = Array<string>();
  
  constructor(url:string){
    this.url = url;
  }

  public connect():boolean{

    if (!this.ws || this.ws.closed ){
      this.ws = new WebSocketSubject(this.url);
    }
    
    this.ws.subscribe({
      error: (err) => { // Called whenever there is a message from the server.
        let errorMsg = JSON.stringify(err);
        if (this.resultError) {this.resultError(errorMsg );}
      },
      complete: () => {
        if (this.resultClosed) {this.resultClosed();}
      }
    });
    
    return !this.ws.closed;
  }
  
  public send<T extends Packets.MultiTypeMessage>(
    request: Packets.Request.Message, 
    reply: new (msgClasses: Array<string>)=>T, 
    recieved?:(message:T, messageName: string) => void,
    ...msgClasses: Array<string>){
      
    if (this.ws == null) {return false}
    
    /*
    let messageType = request.messageName()
    let messageObserver = this.ws.multiplex(
      ()=>({subscribe: messageType}),
      ()=>({unsubscribe: messageType}),
      (message:any) => message.type === messageType
    )
    */

    this.ws.subscribe({
      next: (payload) => { // Called whenever there is a message from the server.
        let msg = new reply(msgClasses);
        let messageName = msg.fromPacketStr(payload);
        
        if (messageName !== "" && recieved){ recieved(msg, messageName); }
      } 
    });


    let packet = request.toPacket();
    this.ws.next(packet);

    return this.ws;
  }
}

export namespace Commands{

  export class Command{
    public ws?: CoCoSocket;
    public url?:string; 
    public resultHandshake?:(message:Packets.Reply.Handshake)=>void; 
    public resultClosed?:()=>void;
    public resultError?:(error:any)=>void;

    constructor(url:string){
      this.url = url;
    }

    public run(){
      this.ws = new CoCoSocket(this.url!);
      this.ws.resultError = (error)=>{ this.connectionError(error); };
      this.ws.resultClosed = ()=>{ this.connectionClosed(); };
      this.ws.connect();

      let msg = new Packets.Request.Handshake();
      this.ws.send(msg, Packets.Reply.Handshake, 
        (message)=>{this.handshakeRecieved(message)} );
    }

    public connectionClosed(){

      //alert("Command:connectionClosed");
      if (this.resultClosed){ this.resultClosed();}
    }

    public connectionError(error:any){
      //alert("Command:connectionError "+error);
      if (this.resultError){ this.resultError(error);}
    }

    public handshakeRecieved(message:Packets.Reply.Handshake){
      //alert("Command:handshakeRecieved");
      if (this.resultHandshake && message) { this.resultHandshake(message); }
    }
  }

  export class MultiTypeCommand{
    public ws?: MultiTypeCoCoSocket;
    public url?:string; 
    public resultHandshake?:(message:Packets.Reply.Handshake)=>void; 
    public resultClosed?:()=>void;
    public resultError?:(error:any)=>void;

    constructor(url:string){
      this.url = url;
    }

    public run(){
      this.ws = new MultiTypeCoCoSocket(this.url!);
      this.ws.resultError = (error)=>{ this.connectionError(error); };
      this.ws.resultClosed = ()=>{ this.connectionClosed(); };
      this.ws.connect();

      let msg = new Packets.Request.Handshake();
      this.ws.send(msg, Packets.Reply.Handshake, (message, messageName)=>{
        this.handshakeRecieved(message)
      }, Packets.Reply.Handshake.name);
    }

    public connectionClosed(){
      //alert("Command:connectionClosed");
      if (this.resultClosed){ this.resultClosed();}
    }

    public connectionError(error:any){
      //alert("Command:connectionError "+error);
      if (this.resultError){ this.resultError(error);}
    }

    public handshakeRecieved(message:Packets.Reply.Handshake){
      //alert("Command:handshakeRecieved");
      if (this.resultHandshake && message) { this.resultHandshake(message); }
    }
  }

  export class GameList extends Command{
    public gameListReceived?:(message:Packets.Reply.GameList)=>void
    
    public override handshakeRecieved( message: Packets.Reply.Handshake){
      //alert("GameList:handshakeRecieved");
      super.handshakeRecieved(message);

      let msg = new Packets.Request.GameList();
      this.ws!.send(msg, Packets.Reply.GameList, (message)=>{ if(this.gameListReceived && message) this.gameListReceived(message) });
    }
  }

  export class LobbyList extends Command{
    public lobbyListReceived?:(message:Packets.Reply.LobbyList)=>void;
    
    public override handshakeRecieved( message: Packets.Reply.Handshake){
      super.handshakeRecieved(message);
      
      let msg = new Packets.Request.LobbyList();
      this.ws!.send(msg, Packets.Reply.LobbyList, (message)=>{ if(this.lobbyListReceived && message) this.lobbyListReceived(message)});
    }
  }

  export class CreateNewLobby extends Command {
    public newLobbyCreated?:(message:Packets.Reply.GameNew)=>void;
    private msg?:Packets.Request.GameNew;

    constructor(url:string, lobby_name?:string, game_name?:string, num_palyer?:number, num_bots?:number, timeout?:number, args?:{}, password?:string, verification?:string){
      super(url);

      this.msg = new Packets.Request.GameNew(lobby_name, game_name, num_palyer, num_bots, timeout, args, password, verification);
    }

    public override handshakeRecieved( message: Packets.Reply.Handshake){
      super.handshakeRecieved(message);

      this.ws!.send(this.msg!, Packets.Reply.GameNew, (message)=>{ if(this.newLobbyCreated && message) this.newLobbyCreated(message) });
    }
  }

  export class Connect extends MultiTypeCommand{
    public lobbyJoined?:(message:Packets.Reply.LobbyJoinedMatch )=>void;
    public lobbyUpdated?:(message:Packets.Reply.LobbyUpdate)=>void;
    private msg?:Packets.Request.LobbyJoinMatch;

    constructor(url:string, lobby_id:string, player_name:string, lobby_password?:string){
      super(url);

      this.msg = new Packets.Request.LobbyJoinMatch(lobby_id, player_name, lobby_password);
    }

    public override handshakeRecieved(message: Packets.Reply.Handshake){
      super.handshakeRecieved(message);

      this.ws!.send(this.msg!, Packets.Reply.ConnectReply,
        (message, messageName)=>{ 
        
        if(this.lobbyJoined && message && messageName === Packets.Reply.LobbyJoinedMatch.name)
          this.lobbyJoined(message as Packets.Reply.LobbyJoinedMatch);
        else if(this.lobbyUpdated && message && messageName === Packets.Reply.LobbyUpdate.name)
          this.lobbyUpdated(message as Packets.Reply.LobbyUpdate);
      }, Packets.Reply.LobbyJoinedMatch.name, Packets.Reply.LobbyUpdate.name);
    }
  }
}


export namespace Packets{

  export class Message{
    public messageName():string{
      return this.constructor.name;
    }

    public toPacket(): any{
      const packetName = this.messageName();
      const packet = { [packetName]:this };
      return packet;
    }

    public fromPacket(packet:any): boolean{
      const msgClass = this.messageName();
      
      if (! (msgClass in packet) ){ 
        return false; 
      }
      
      const msgData = packet[msgClass];
      
      for (var msgField in this) {
        if (! (msgField in msgData)){ continue; }
        const varType = typeof msgData[msgField];
        if (varType in ["function","undefined","symbol"] ){ continue; }

        if (varType === "object") {
          this[msgField] = Object.assign(msgData[msgField]);
        } else {
          this[msgField] = msgData[msgField];
        }
      }
      //alert("Deserialized msg "+ msg.MessageName() ) ;
      return true;
    }

    public static Deserialize<T extends Message>(payload:string, cls: new ()=>T):T | null{
      const msg = new cls();
      if (msg.fromPacket(payload) === false ) {return null;}
      return msg;
    }
  }

  export class MultiTypeMessage extends Message{
    public msgClasses: Array<string>;

    constructor(msgClasses: Array<string>){
      super();
      this.msgClasses = [];

      msgClasses.forEach((msgClass) => {
        this.msgClasses.push(msgClass);
      });
    }

    public toPacketWithName(messageName: string){
      const packet = { [messageName]:this };
      return packet;
    }

    public fromPacketStr(packet:any): string{
      var msgClass;

      this.msgClasses.forEach((msgName) => {
        if(msgName in packet){
          msgClass = msgName;
        }
      });

      if (!msgClass){ 
        return ""; 
      }

      const msgData = packet[msgClass];
      
      for (var msgField in this) {
        if (! (msgField in msgData)){ continue; }
        const varType = typeof msgData[msgField];
        if (varType in ["function","undefined","symbol"] ){ continue; }

        if (varType === "object") {
          this[msgField] = Object.assign(msgData[msgField]);
        } else {
          this[msgField] = msgData[msgField];
        }
      }

      return msgClass;
    }
  }

  export class GameParams {
    public players?:number;
    public bots?:number;
    public timeout?:number;

    constructor(players=0, bots=0, timeout=30.0){
      this.players = players;
      this.bots = bots;
      this.timeout = timeout;
    }
  }

  export class Result<T1,T2>{
    public Ok?: T1;
    public Err?: T2;
  }

  export class MatchInfo {
      public players: number=0;
      public bots: number=0;
      public timeout: number=0.0;
      public args = {};
      public id: string="";
      public name: string="";
      public game: string="";
      public running: boolean=false;
      public time: number=0;
      public connected={};
      public spectators: number=0;
      public password: boolean=false;
      public verified: boolean=false;
  }
  
  // Requests ---------------------------------
  export namespace Request{
    export class Message extends Packets.Message {}
    export class Handshake extends MultiTypeMessage {
      public version: number = 1;
      public magic: string = "coco";

      constructor(){
        super(['Handshake']);
      }
    }
    export class GameList extends Message  {}
    export class GameDescription extends Message  {
      name: string = "";
    }
    export class GameNew extends Message  {
      name?:string;
      game?:string;
      params?:GameParams;
      args?:{};   
      password?:string;
      verification?:string;

      constructor(name="", game="", players?:number, bots?:number, timeout?:number, args={}, password?:string, verification?:string) {
        super();
        this.name = name;
        this.game = game;
        this.params = new GameParams(players, bots, timeout);
        this.args = args;
        this.password = password;
        this.verification = verification;
      }
    }
    export class LobbyList extends Message  {}
    export class LobbySubscribe extends Message {}
    export class LobbyUnsubscribe extends Message {}
    export class LobbyJoinMatch extends Message {
      id?: string;
      name?: string;
      password?: string;

      constructor(id="", name="", password?:string){
        super();
        this.id = id;
        this.name = name;
        this.password = password;
      }
    }
    export class LobbyLeaveMatch extends Message {}
    export class SpectateJoin extends Message {
      id: string=""
    }
    export class SpectateLeave extends Message  {}
  }



// Replay ---------------------------------

  export namespace Reply{
    export class Message extends Packets.Message {}
    export class Handshake extends MultiTypeMessage {
      public magic: string = "";

      constructor(){
        super(['Handshake']);
      }
    }
    export class GameList extends Message { 
      public games= new Array<string>() 
    }
    export class GameDescription extends Message { 
      public  description: string = "" 
    }
    export class GameNew extends Message {
      public id = {"Ok": "", "Err": ""}
    }

    export class LobbyList extends Message {
      public info= new Array<MatchInfo>()
    }

    export class LobbySubscribed extends Message { 
      public seed = Array<MatchInfo>() 
    }

    export class ConnectReply extends MultiTypeMessage {}

    export class LobbyJoinedMatch extends ConnectReply { 
      public info = new Result<MatchInfo,string>() 
    }
    export class LobbyNew extends Message { 
      public info = new MatchInfo() 
    }
    export class LobbyUpdate extends ConnectReply {
      public info = new MatchInfo()
    }
    export class LobbyDelete extends Message { 
      public id: string = ""
    }
    export class LobbyUnsubscribed extends Message{}
    export class LobbyLeavedMatch extends Message {}
    export class MatchStartedReply extends Message{}
    export class MatchEnded extends Message {}
    export class SpectateJoined extends Message { 
      public info=new Result<MatchInfo,string>()
    }
    export class SpectateStarted extends Message {}
    export class SpectateSynced extends Message {}
    export class SpectateEnded extends Message {}
    export class SpectateLeaved extends Message{}
  }
}
