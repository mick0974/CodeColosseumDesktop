import { WebSocketSubject } from 'rxjs/webSocket';
import { Packets } from './api.packets';


export class CoCoSocket{
  public url = 'ws://localhost:8088';
  public ws?:WebSocketSubject<any>;
  
  public binEncoder = new TextEncoder(); // always utf-8
  public binDecoder = new TextDecoder("utf-8");
  
  public onError?:(error:string)=>void;
  public onClose?:()=>void;
  public onRecive?:(payload: Packets.PacketsPayload) => void;
  public onReciveBinary?:(payload: string) => void;
      
  constructor(url:string){
    this.url = url;

    if (!this.ws || this.ws.closed ){
      this.ws = new WebSocketSubject({
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
      this.ws.subscribe({
        next: (payload:any)=>{ this.didRecieve(payload) },
        error: (error:any)=>{ this.didError(error) },
        complete: ()=>{ this.didClose() },
      });

      console.log("Created new socket");
    }
  }

  public isOpen():boolean{
    return (!!this.ws) && !this.ws.closed;
  }

  public closeConnection(){
    this.ws!.unsubscribe();
    this.ws!.complete();
    console.log("CoCoSocket:closeConnection");
  }
  
  public send(request: Packets.Request.Message){
    if (!this.isOpen()) {
      this.didError("CoCoSocket:send: unable to send, socket is null")
      return false
    } 
    
    let packet = request.toPacket();
    this.ws!.next(packet);

    return true;
  }

  public sendBinary(data: string) {
    let payload = this.binEncoder.encode(data);
    if (!this.isOpen()) {
      this.didError("CoCoSocket:sendBinary: unable to send, socket is null")
      return false
    } 
    console.log("CoCoSocket:sendBinary: sending payload \n"+payload);
    this.ws!.next(payload.buffer);
    return true;
  }
  
  public didRecieve(payload:MessageEvent){ // Called whenever there is a message from the server.
    /*
    if(!this.isOpen()){
      this.didError("CoCoSocket:didRecieve: closing connection")
      this.closeConnection();
    }
    */

    let data = payload.data;
    console.log("CoCoSocket:didRecieve:type: "+payload.constructor.name+"<"+payload.data.constructor.name+">" )
    if(typeof data === "object" && data instanceof ArrayBuffer) {
      if (data.byteLength == 0) {return}
      data = this.binDecoder.decode(data);
      console.log("CoCoSocket:didRecieve:binary:\n"+data)
      if(this.onReciveBinary){ this.onReciveBinary( data );}
    } else{
      let packetsPayload = new Packets.PacketsPayload(data)
      console.log("CoCoSocket:didRecieve:packets: "+packetsPayload.packetTypes)
      if(this.onRecive){ this.onRecive( packetsPayload ); }
      
    }
  }

  public didError(err:string) { 
    let errorMsg = JSON.stringify(err);
    if (this.onError) { this.onError(errorMsg );}
  }

  public didClose() { 
    this.closeConnection();
    if (this.onClose) { this.onClose();}
  }
}




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
