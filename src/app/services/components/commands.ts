import { CoCoSockets } from "./socket";
import { Packets } from "./packets";

export namespace Commands{

  export class Command{
    public ws!: CoCoSockets.CoCoSocket;
    public resultHandshake?:(message:Packets.Reply.Handshake)=>void; 
    public webSocketClosed?:()=>void;
    public webSocketError?:(error:any)=>void;

    constructor(ws:CoCoSockets.CoCoSocket){
      this.ws = ws;
    }

    public run(){
      this.ws.resultError = (error)=>{ this.connectionError(error); };
      this.ws.resultClosed = ()=>{ this.connectionClosed(); };
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
      if (this.webSocketClosed){ this.webSocketClosed();}
    }

    public connectionError(error:any){
      if (this.webSocketError){ this.webSocketError(error);}
    }

    public handshakeRecieved(message:Packets.Reply.Handshake){
      if (this.resultHandshake && message) { this.resultHandshake(message); }
    }
  }

  export class GameList extends Command{
    public gameListed?:(message:Packets.Reply.GameList)=>void;
    
    public override handshakeRecieved( handshake: Packets.Reply.Handshake){
      super.handshakeRecieved(handshake);

      let msg = new Packets.Request.GameList();
      this.ws!.send(msg, (payload, msgClass) => {
        let msgName = Packets.Message.findPacketName(msgClass, payload);
        
        if(this.gameListed) {
          let message = new Packets.Reply.GameList();
          message.fromMultiPacket(payload, msgName);
          
          if(message){
            this.ws.closeConnection();
            this.gameListed(message as Packets.Reply.GameList);
          }
        }
      }, Packets.Reply.GameList.name);
    }
  }

  export class GameDescription extends Command{
    public gameDescripted?:(message:Packets.Reply.GameDescription)=>void
    private msg?: Packets.Request.GameDescription;

    constructor(ws:CoCoSockets.CoCoSocket, game:string) {
      super(ws);
      this.msg = new Packets.Request.GameDescription(game);
    }
    
    public override handshakeRecieved( handshake: Packets.Reply.Handshake){
      super.handshakeRecieved(handshake);

      this.ws!.send(this.msg!, (payload, msgClass) => {
        let msgName = Packets.Message.findPacketName(msgClass, payload);
        
        if(this.gameDescripted) {
          let message = new Packets.Reply.GameDescription();
          message.fromMultiPacket(payload, msgName);
          
          if(message){
            this.ws.closeConnection();
            this.gameDescripted(message as Packets.Reply.GameDescription);
          }
        }
      }, Packets.Reply.GameDescription.name);
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
          
          if(message){
            this.ws.closeConnection();
            this.lobbyListReceived(message);
          }
        }
      }, Packets.Reply.LobbyList.name);
    }
  }

  export class CreateNewLobby extends Command {
    public newLobbyCreated?:(message:Packets.Reply.GameNew)=>void;
    private msg?:Packets.Request.GameNew;

    constructor(ws:CoCoSockets.CoCoSocket, lobby_name?:string, game_name?:string, num_palyer?:number, num_bots?:number, timeout?:number, args?:any, password?:string, verification?:string){
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

            if(message){
              this.ws.closeConnection();
              this.newLobbyCreated(message);
            }
        }
      }, Packets.Reply.GameNew.name);
    }
  }

  export class Connect extends Command{
    public lobbyJoined?:(message:Packets.MatchInfo )=>void;
    public lobbyUpdated?:(message:Packets.MatchInfo)=>void;
    public matchStarted?:()=>void;
    public binaryInfo?: (payload:string) => void;
    public matchEnded?:() => void;
    public apiError?:(error:string) => void;
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
            if(this.binaryInfo) { this.binaryInfo(payload); }
          } else {
            let msgName = Packets.Message.findPacketName(msgClasses, payload);
            
            if(this.lobbyJoined && payload && msgName === Packets.Reply.LobbyJoinedMatch.name){
              let message = new Packets.Reply.LobbyJoinedMatch();
              message.fromMultiPacket(payload, msgName);

              if(message.info["Err"] != undefined) {
                this.ws.closeConnection();
                if(this.apiError) {this.apiError(message.info["Err"])}
              }
              else {
                this.lobbyJoined(message.info["Ok"]);
              }
              
            }
            else if(this.lobbyUpdated && payload && msgName === Packets.Reply.LobbyUpdate.name){
              let message = new Packets.Reply.LobbyUpdate();
              message.fromMultiPacket(payload, msgName);
              this.lobbyUpdated(message.info);
            }
            else if(this.matchStarted && payload && msgName === Packets.Reply.MatchStarted.name){
              let message = new Packets.Reply.MatchStarted();
              message.fromMultiPacket(payload, msgName);
              this.matchStarted();
            }
            else if(this.matchEnded && payload && msgName === Packets.Reply.MatchEnded.name){
              this.ws.closeConnection();

              let message = new Packets.Reply.MatchEnded();
              message.fromMultiPacket(payload, msgName);
              this.matchEnded();
            }
          }
        
      }, 
      Packets.Reply.LobbyJoinedMatch.name, Packets.Reply.LobbyUpdate.name,
        Packets.Reply.MatchStarted.name, Packets.Reply.MatchEnded.name);
    }
  }

  export class Play extends Command{
    public msg?: ArrayBuffer;
    
    constructor(ws:CoCoSockets.CoCoSocket, inputString:string){
      super(ws);

      var enc = new TextEncoder(); // always utf-8
      this.msg = (enc.encode(inputString)).buffer;
    }

    public override run(){
      this.ws.sendBinary(this.msg!);
    }
  }

  export class Spectate extends Command{
    public spectateJoined?:(message:Packets.MatchInfo )=>void;
    public spectateStarted?:()=>void;
    public spectatSynced?:()=>void;
    public lobbyUpdated?:(message:Packets.MatchInfo)=>void;
    public binaryMessage?: (message:string) => void;
    public spectateEnded?:()=>void;
    public apiError?:(error:string) => void;
    private msg?:Packets.Request.SpectateJoin;

    constructor(ws:CoCoSockets.CoCoSocket, lobby_id:string){
      super(ws);

      this.msg = new Packets.Request.SpectateJoin(lobby_id);
    }

    public override handshakeRecieved(handshake: Packets.Reply.Handshake){
      super.handshakeRecieved(handshake);

      this.ws!.send(this.msg!,
        (payload, msgClasses)=>{ 
          if(msgClasses[0] === "binary") {
            if(this.binaryMessage) {this.binaryMessage(payload);}
          } else {
            let msgName = Packets.Message.findPacketName(msgClasses, payload);

            if(this.spectateJoined && payload && msgName === Packets.Reply.SpectateJoined.name){
              let message = new Packets.Reply.SpectateJoined();
              message.fromMultiPacket(payload, msgName);
              
              if(message.info["Err"] != undefined) {
                this.ws.closeConnection();
                if(this.apiError) {this.apiError(message.info["Err"])}
              }
              else {
                this.spectateJoined(message.info["Ok"]);
              }
            }
            else if(this.spectateStarted && payload && msgName === Packets.Reply.SpectateStarted.name){
              let message = new Packets.Reply.SpectateStarted();
              message.fromMultiPacket(payload, msgName);
              this.spectateStarted();
            }
            else if(this.spectatSynced && payload && msgName === Packets.Reply.SpectateSynced.name){
              let message = new Packets.Reply.SpectateSynced();
              message.fromMultiPacket(payload, msgName);
              this.spectatSynced();
            }
            else if(this.lobbyUpdated && payload && msgName === Packets.Reply.LobbyUpdate.name){
              let message = new Packets.Reply.LobbyUpdate();
              message.fromMultiPacket(payload, msgName);
              this.lobbyUpdated(message.info);
            }
            else if(this.spectateEnded && payload && msgName === Packets.Reply.SpectateEnded.name){
              this.ws.closeConnection();

              let message = new Packets.Reply.SpectateEnded();
              message.fromMultiPacket(payload, msgName);
              this.spectateEnded();
            }
          }
      }, 
      Packets.Reply.SpectateJoined.name, Packets.Reply.SpectateStarted.name,
        Packets.Reply.SpectateSynced.name, Packets.Reply.LobbyUpdate.name, 
        Packets.Reply.SpectateEnded.name);
    }
  }
}