import { CoCoSockets } from "./socket";
import { Packets } from "./packets";

export namespace Commands{
    /*
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
        this.ws.send(msg,
          (payload, msgClass)=>{
            let msgName = Packets.Message.findPacketName(msgClass, payload);
            let message = new Packets.Reply.Handshake();
            message.fromMultiPacket(payload, msgName);
            this.handshakeRecieved(message)}, 
        Packets.Reply.Handshake.name );
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
    */

    export class Command{
      public ws!: CoCoSockets.CoCoSocket;
      //public url?:string; 
      public resultHandshake?:(message:Packets.Reply.Handshake)=>void; 
      public resultClosed?:()=>void;
      public resultError?:(error:any)=>void;
  
      constructor(ws:CoCoSockets.CoCoSocket){
        this.ws = ws;
      }
  
      public run(){
        this.ws.resultError = (error)=>{ this.connectionError(error); };
        //this.ws.resultClosed = ()=>{ this.connectionClosed(); };
        this.ws.resultClosed = ()=>{ console.log("---- Connessione chiusa ----") };
        //this.ws.recieved = (payload, msgClasses)=> {this.handshakeRecieved(payload);}
        this.ws.setSubscription();
  
        let msg = new Packets.Request.Handshake();
        this.ws.send(msg, (payload, msgClasses)=>{
          if(msgClasses[0] !== "binary") {
            let msgName = Packets.Message.findPacketName(msgClasses, payload);

            if(msgName === Packets.Reply.Handshake.name){
              let message = new Packets.Reply.Handshake();
              message.fromMultiPacket(payload, msgName);
              this.handshakeRecieved(message);
            }
          }
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
      
      
      public override handshakeRecieved( handshake: Packets.Reply.Handshake){
        //alert("GameList:handshakeRecieved");
        super.handshakeRecieved(handshake);
  
        let msg = new Packets.Request.GameList();
        this.ws!.send(msg, (payload, msgClass) => {
          let msgName = Packets.Message.findPacketName(msgClass, payload);
          
          if(this.gameListReceived) {
            let message = new Packets.Reply.GameList();
            message.fromMultiPacket(payload, msgName);
            
            if(message)
              this.gameListReceived(message as Packets.Reply.GameList);
          }
        }, Packets.Reply.GameList.name);
      }
    }
  
    export class LobbyList extends Command{
      public lobbyListReceived?:(message:Packets.Reply.LobbyList)=>void;
      
      public override handshakeRecieved( handshake: Packets.Reply.Handshake){
        super.handshakeRecieved(handshake);
        
        let msg = new Packets.Request.LobbyList();
        this.ws!.send(msg, (payload, msgClass)=>{ 
          let msgName = Packets.Message.findPacketName(msgClass, payload);

          if(this.lobbyListReceived){
            let message = new Packets.Reply.LobbyList();
            message.fromMultiPacket(payload, msgName);
            
            if(message)
              this.lobbyListReceived(message);
          }
        }, Packets.Reply.LobbyList.name);
      }
    }
  
    export class CreateNewLobby extends Command {
      public newLobbyCreated?:(message:Packets.Reply.GameNew)=>void;
      private msg?:Packets.Request.GameNew;
  
      constructor(ws:CoCoSockets.CoCoSocket, lobby_name?:string, game_name?:string, num_palyer?:number, num_bots?:number, timeout?:number, args?:{}, password?:string, verification?:string){
        super(ws);
  
        this.msg = new Packets.Request.GameNew(lobby_name, game_name, num_palyer, num_bots, timeout, args, password, verification);
      }
  
      public override handshakeRecieved( handshake: Packets.Reply.Handshake){
        super.handshakeRecieved(handshake);
  
        this.ws!.send(this.msg!, 
          (payload, msgClass)=>{ 
            let msgName = Packets.Message.findPacketName(msgClass, payload);
            
            if(this.newLobbyCreated){
              let message = new Packets.Reply.GameNew();
              message.fromMultiPacket(payload, msgName);

              if(message)
                this.newLobbyCreated(message);
          }
        }, Packets.Reply.GameNew.name);
      }
    }
  
    export class Connect extends Command{
      public lobbyJoined?:(message:Packets.Reply.LobbyJoinedMatch )=>void;
      public lobbyUpdated?:(message:Packets.Reply.LobbyUpdate)=>void;
      public matchStarted?:(message:Packets.Reply.MatchStarted)=>void;
      public binaryInfo?: (payload:string) => void;
      private msg?:Packets.Request.LobbyJoinMatch;
  
      constructor(ws:CoCoSockets.CoCoSocket, lobby_id:string, player_name:string, lobby_password?:string){
        super(ws);
  
        this.msg = new Packets.Request.LobbyJoinMatch(lobby_id, player_name, lobby_password);
      }
  
      public override handshakeRecieved(handshake: Packets.Reply.Handshake){
        super.handshakeRecieved(handshake);
  
        this.ws!.send(this.msg!,
          (payload, msgClasses)=>{ 
            if(msgClasses[0] === "binary") {
              if(this.binaryInfo) {this.binaryInfo(payload);}
            } else {
              let msgName = Packets.Message.findPacketName(msgClasses, payload);

              if(this.lobbyJoined && handshake && msgName === Packets.Reply.LobbyJoinedMatch.name){
                let message = new Packets.Reply.LobbyJoinedMatch();
                message.fromMultiPacket(payload, msgName);
                this.lobbyJoined(message);
              }
              else if(this.lobbyUpdated && handshake && msgName === Packets.Reply.LobbyUpdate.name){
                let message = new Packets.Reply.LobbyUpdate();
                message.fromMultiPacket(payload, msgName);
                this.lobbyUpdated(message);
              }
              else if(this.matchStarted && handshake && msgName === Packets.Reply.MatchStarted.name){
                let message = new Packets.Reply.MatchStarted();
                message.fromMultiPacket(payload, msgName);
                this.matchStarted(message);
              }
            }
          
        }, 
        Packets.Reply.LobbyJoinedMatch.name, Packets.Reply.LobbyUpdate.name,
          Packets.Reply.MatchStarted.name);
      }
    }

    export class Play extends Command{
      public matchEnded?:(message:Packets.Reply.MatchEnded)=>void;
      public binaryInfo?: (payload:string) => void;
      public msg?: ArrayBuffer;
      
      constructor(ws:CoCoSockets.CoCoSocket, inputString:string){
        super(ws);
        //this.msg = this.str2ab(inputString);

        var enc = new TextEncoder(); // always utf-8
        this.msg = (enc.encode(inputString)).buffer;
        console.log(this.msg);
      }

      private str2ab(str:string) {
        var buf = new ArrayBuffer(str.length); // 2 bytes for each char
        var bufView = new Uint8Array(buf);
        for (var i=0, strLen=str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
        }
        return buf;
      }

      public override run(){
        this.ws.resultError = (error)=>{ this.connectionError(error); };
        this.ws.resultClosed = ()=>{ this.connectionClosed(); };
        this.ws.setSubscription();

        console.log("Run play");

        this.ws.sendBinary(this.msg!, (payload, msgClasses)=>{
          if(msgClasses[0] !== "binary") {
            let msgName = Packets.Message.findPacketName(msgClasses, payload);

            if(msgName === Packets.Reply.Handshake.name){
              let message = new Packets.Reply.Handshake();
              message.fromMultiPacket(payload, msgName);
              this.handshakeRecieved(message);
            } else {
              console.log("Match finito: " + payload);
            }
          } else {
            console.log("Risposta bot: " + payload);
          }
        }, Packets.Reply.MatchEnded.name);
      }


    }
  }