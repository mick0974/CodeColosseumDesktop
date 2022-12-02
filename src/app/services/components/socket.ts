import { WebSocketSubject } from 'rxjs/webSocket';
import { Packets } from './packets';

export namespace CoCoSockets{
  /*
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
  */
  
  export class CoCoSocket{
    public url = 'ws://localhost:8088';
    public ws?:any;
    public resultError?:(error:string)=>void;
    public resultClosed?:()=>void;
    
    //public recieved?: (payload: string, msgClasses: Array<string>) => void;
    public msgClasses = Array<string>();
    
    constructor(url:string){
      this.url = url;

      if (!this.ws || this.ws.closed ){
        this.ws = new WebSocketSubject(
          {
            url: this.url,
            binaryType: "arraybuffer",
            deserializer: msg => msg,
            serializer: msg => {
              if (msg instanceof ArrayBuffer)
                return msg;
              else
                return JSON.stringify(msg);
            }
          });

          console.log("Created new socket");
      }
    }
  
    public setSubscription():boolean{
      this.ws.subscribe({
        error: (err:string) => { // Called whenever there is a message from the server.
          let errorMsg = JSON.stringify(err);
          if (this.resultError) {this.resultError(errorMsg );}
        },
        complete: () => {
          if (this.resultClosed) {this.resultClosed();}
        }
      });
      
      return !this.ws.closed;
    }
    
    public send(
      request: Packets.Request.Message, 
      recieved?:(payload: string, msgClasses: Array<string>) => void,
      //recievedBinary?:(payload: string) => void,
      ...msgClasses: Array<string>){
        
      if (this.ws == null) {return false} 
  
      this.ws.subscribe({
        next: (payload:any) => { // Called whenever there is a message from the server.
          
          if(typeof payload.data === "object") {
            var enc = new TextDecoder("utf-8");
            if(recieved){recieved( enc.decode(payload.data), ["binary"]); }
          } else {
            if (recieved){ recieved(payload.data, msgClasses); }
          }
        } 
      });
  
      let packet = request.toPacket();
      this.ws.next(packet);
  
      return this.ws;
    }

    public sendBinary(
      request: ArrayBuffer, 
      recieved?:(payload: string, msgClasses: Array<string>) => void,
      ...msgClasses: Array<string>) {

      if (this.ws == null) {return false} 
  
      this.ws.subscribe({
        next: (payload:any) => { // Called whenever there is a message from the server.
          console.log("sendBinary subscribe");
          
          if(typeof payload.data === "object") {
            var enc = new TextDecoder("utf-8");
            if(recieved){recieved( enc.decode(payload.data), ["binary"]); }
          } else {
            if (recieved){ recieved(payload.data, msgClasses); }
          }
        } 
      });

      console.log(request);
      this.ws.next(request);
      return this.ws;
    }
  }
}