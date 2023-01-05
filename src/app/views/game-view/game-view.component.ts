import { Component, OnInit } from '@angular/core';
import { ApiService, MatchInfo } from 'src/app/services/api-service/api.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ConnectionManagerService } from 'src/app/services/connection-manager.service';
import { LobbyEventType } from 'src/app/services/api-service/api.service';
import { ChatMessage } from 'src/app/ChatMessage';
import { TauriService } from '../../services/tauri-service/tauri.service';
import { ConnectCommand } from '../../services/api-service/api.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent implements OnInit {

  //Connect command
  connectCmd?: ConnectCommand;

  //Gen
  game! : MatchInfo | null;
  gameId : string= "" ;
  gameName : string = "";
  currStep : number = 0;
  hasPassword:boolean = true;
  errorMessage:string="";

  // Upload screen
  myfile:any[] = [];
  submitted:boolean = false;
  currProgramName:string = "No uploaded file yet."
  uploadData:any={};

  // Messages from APIs
  lastMatchState!:MatchInfo;
  newMsg:string = "";
  messages:ChatMessage[] = [];

  executableParameters:string = "";

  firstBinaryMsg = true;

  tauriService = new TauriService();

  constructor(private router:Router,
    private activatedroute:ActivatedRoute,
    private connectionManager:ConnectionManagerService,
    private apiService:ApiService,
    private connectionService:ConnectionManagerService,
    private ref:ChangeDetectorRef) { }

  ngOnInit(): void {
    let token = this.activatedroute.snapshot.paramMap.get('id');
    // Asks APIs for list and saves game if current game exists
    let validLobbies:MatchInfo[]=[]
    if (token){
      let onSuccess = (matchList:MatchInfo[])=>{
        validLobbies=matchList;
        //Check if this ID exists, if so saves game in this.game
        validLobbies.find( (g) => (this.game = g.id === token ? g : null) )  
        if (this.game){
          this.gameId = this.game!.id;
          this.gameName = this.game!.name;
          this.hasPassword = this.game.password ? true : false;
          console.log("Gameview: Joining game " + this.game)
        }
        else{
          this.game=null;
          console.log("Gameview: game token is not valid.")
        }
      }
      this.connectionManager.lobbyList1(onSuccess)
    }
    else {
      this.game=null;
      console.log("Gameview: No token was given.")
    }
  }


  // UPLOAD METHODS

  navigateToPlay():void{
    this.submitted=true;
    // TODO! Checks compilation of stuff, emtpy for testing then everything will ned to be in here
    if ((this.hasPassword && this.uploadData.password&&this.uploadData.program)||(!this.hasPassword &&this.uploadData.program)){ 
    
      // When first connection is established with apiService.connectToPlat, 
      // client will receive a JoinEvent (that will execute a onEvent)
      // and a MatchUpdate (that will execute a onMatchUpdate).

    // Executed on join event
    let onEvent = (type:LobbyEventType)=>{
      //TODO handle if connection aint established
      if(type == LobbyEventType.End){
        this.messages.push({sender:"server", content:"Game ended!"})
      }
      else{
        this.currStep=1;
      }
    }

    // Executed on match update (you get a match update immediately after joining, as the #
    // of players has changed.)
    let onMatchUpdate = (matchInfo:MatchInfo)=>{
      console.log("onMatchUpdate (join) was executed")

      if (!this.lastMatchState){
        this.newMsg="Connection established."
        this.messages.push({sender:"server",content:this.newMsg})
        if(matchInfo.connected.length>0){
          this.newMsg="Already connected players: "
          for(let i=0; i < matchInfo.connected.length; i++){
            this.newMsg += matchInfo.connected[i] + ", "
          }
          this.newMsg = this.newMsg.substring(0,this.newMsg.length-2)
          this.messages.push({sender:"server",content:this.newMsg})
        }
      }
      else{ 
        // Check if game started running
        if (!this.lastMatchState.running && matchInfo.running){
          this.messages.push({sender:"server",content:"Game is starting!"})
          this.messages.push({sender:"divider",content:"Game started!"})

          this.launchTauri();
        }
  
        // this finds the name of the new player that has joined.
        let newPlayer="";
        let pastConnected=this.lastMatchState.connected;
        let newConnected=matchInfo.connected=matchInfo.connected
        if(pastConnected.length < newConnected.length){
          newPlayer=newConnected.filter((item)=>pastConnected.indexOf(item))[0]
          this.newMsg=newPlayer+" has joined the match!";
          this.messages.push({sender:"server",content:this.newMsg})
        }
        else if (pastConnected.length > newConnected.length){
          newPlayer=pastConnected.filter((item)=>newConnected.indexOf(item))[0]
          this.newMsg=newPlayer+" has left the match!";
          this.messages.push({sender:"server",content:this.newMsg})
        }
      }
      this.lastMatchState=matchInfo;
    }

      let onData = (data:string)=>{
        if(data != ""){
          
          let sender = this.firstBinaryMsg ? "server" : "other";

          this.firstBinaryMsg = false;

          this.messages.push({sender:sender, content:data});
          this.sendToTauri(data);
        }
      }
    
      let onError = (errorMessage:string)=>{
        this.errorMessage = errorMessage;
        console.log(errorMessage)
      }

      this.connectCmd = this.apiService.connectToPlay(
        this.game!.id,
        this.connectionService.username,
        this.uploadData.password,
        onEvent,
        onMatchUpdate,
        onData,
        onError
      )
    }
  }

  fileUpload(event:any){
    this.uploadData.program = event.target.files[0];
    this.currProgramName = this.uploadData.program.name;

    this.tauriService.uploadFile(this.uploadData.program, ()=>{
      this.currProgramName = this.uploadData.program.name;
      this.ref.detectChanges();
    }, (reason)=>{
      console.log("Error, could not write file: " + reason)
    })
  }

  navigateToUpload():void{
    this.currStep=0;
  }

  sendToTauri(message:string) {
    this.tauriService.sendToProcess(message);
  }

  launchTauri(){
    console.log("Launching Tauri process");

    let onStdOut = (output:string) => {
      console.log("Tauri output: " + output);
      this.messages.push({sender:"me",content: output});
      this.connectCmd?.sendBinary(output);
    }

    let onStdErr = (error:string) => {
      console.log("Errore nel processo tauri: " + error);
    }

    let params = this.executableParameters.trim();
    let paramsArray:string[] = [];

    if(params != ""){
      paramsArray = params.split(",");
      
      for(let i = 0; i < paramsArray.length; i++){
        paramsArray[i] = paramsArray[i].trim();
      }
    }

    console.log(paramsArray.toString());

    //Todo put in actual parameters, these are now hardcoded
    this.tauriService.execProgram(paramsArray, onStdOut, onStdErr);
  }
}