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
  
    export class MultiTypeCommand{
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
        //this.ws.recieved = (payload, msgClasses)=> {this.handshakeRecieved(payload);}
        this.ws.connect();
  
        let msg = new Packets.Request.Handshake();
        this.ws.send(msg, (payload, msgClasses)=>{
          let msgName = Packets.Message.findPacketName(msgClasses, payload);

          if(msgName === Packets.Reply.Handshake.name){
            let message = new Packets.Reply.Handshake();
            message.fromMultiPacket(payload, msgName);
            this.handshakeRecieved(message);
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
  
    export class GameList extends MultiTypeCommand{
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
  
    export class LobbyList extends MultiTypeCommand{
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
  
    export class CreateNewLobby extends MultiTypeCommand {
      public newLobbyCreated?:(message:Packets.Reply.GameNew)=>void;
      private msg?:Packets.Request.GameNew;
  
      constructor(url:string, lobby_name?:string, game_name?:string, num_palyer?:number, num_bots?:number, timeout?:number, args?:{}, password?:string, verification?:string){
        super(url);
  
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
  
    export class Connect extends MultiTypeCommand{
      public lobbyJoined?:(message:Packets.Reply.LobbyJoinedMatch )=>void;
      public lobbyUpdated?:(message:Packets.Reply.LobbyUpdate)=>void;
      public matchStarted?:(message:Packets.Reply.MatchStarted)=>void;
      public binaryInfo?: (payload:string, socket:CoCoSockets.CoCoSocket) => void;
      private msg?:Packets.Request.LobbyJoinMatch;
      
      /*
      public decodeBinary(binary:any){

        // Step 1 
        // Split the binary into an array of strings using the .split() method
        binary = binary.split(' ');
        
        // Step 2
        // Iterate over the elements of the new array create to change each element to a decimal
        binary = binary.map(elem => parseInt(elem,2));

        // Step 3
        // Use String.fromCharCode with .map() to change each element of the array to text 
        binary = binary.map(elem => String.fromCharCode(elem));
        
        // Step 4
        // Add the element of the new array together to create a string. Save it to a new Variable.
        let newText = binary.join("").toUpperCase();
        
        // Step 5 
        // The new string is returned
        return newText;
      }
      */
  
      constructor(url:string, lobby_id:string, player_name:string, lobby_password?:string){
        super(url);
  
        this.msg = new Packets.Request.LobbyJoinMatch(lobby_id, player_name, lobby_password);
      }
  
      public override handshakeRecieved(handshake: Packets.Reply.Handshake){
        super.handshakeRecieved(handshake);
  
        this.ws!.send(this.msg!,
          (payload, msgClasses)=>{ 
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
          
        }, 
        Packets.Reply.LobbyJoinedMatch.name, Packets.Reply.LobbyUpdate.name,
          Packets.Reply.MatchStarted.name);
      }
    }
  }