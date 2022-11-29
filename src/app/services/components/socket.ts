import { WebSocketSubject } from 'rxjs/webSocket';
import { Packets } from './packets';

export namespace CoCoSockets{
  export class CoCoSocket{
    public url: string;
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
}