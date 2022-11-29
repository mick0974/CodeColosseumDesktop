import { CoCoSockets } from "./socket";
import { Packets } from "./packets";

export namespace Commands{

    export class Command{
      public ws?: CoCoSockets.CoCoSocket;
      public url?:string;
      public resultHandshake?:(message:Packets.Reply.Handshake)=>void; 
      public resultClosed?:()=>void;
      public resultError?:(error:any)=>void;
  
      constructor(url:string){
        this.url = url;
      }
  
      public run(){
        this.ws = new CoCoSockets.CoCoSocket(this.url!);
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
      public ws?: CoCoSockets.MultiTypeCoCoSocket;
      public url?:string; 
      public resultHandshake?:(message:Packets.Reply.Handshake)=>void; 
      public resultClosed?:()=>void;
      public resultError?:(error:any)=>void;
  
      constructor(url:string){
        this.url = url;
      }
  
      public run(){
        this.ws = new CoCoSockets.MultiTypeCoCoSocket(this.url!);
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
      public matchStarted?:(message:Packets.Reply.MatchStarted)=>void;
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
          else if(this.matchStarted && message && messageName === Packets.Reply.MatchStarted.name)
            this.matchStarted(message as Packets.Reply.MatchStarted);
        }, Packets.Reply.LobbyJoinedMatch.name, Packets.Reply.LobbyUpdate.name,
          Packets.Reply.MatchStarted.name);
      }
    }
  }