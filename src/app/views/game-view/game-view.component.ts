import { Component, OnInit } from '@angular/core';
import { ApiService, MatchInfo } from 'src/app/services/api-service/api.service';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { UploadService } from 'src/app/services/upload.service';
import { Router } from '@angular/router';
import { ConnectionManagerService } from 'src/app/services/connection-manager.service';
import { LobbyEventType } from 'src/app/services/api-service/api.service';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent implements OnInit {

  //Gen
  game! : MatchInfo | null;
  gameId : string= "" ;
  gameName : string = "";
  currStep : number = 0;
  hasPassword:boolean = true;

  // Upload screen
  myfile:any[] = [];
  submitted:boolean = false;
  currProgramName:string = "No uploaded file yet."
  stateOptions: any[]= [{value:'python',label:'Python'}, {value: 'cpp',label:'C++'}];
  uploadData:any={'programType':"python"};

  // Messages from APIs
  lastMatchState!:MatchInfo;
  newMsg:string="";

  constructor(private router:Router,
    private activatedroute:ActivatedRoute,
    private connectionManager:ConnectionManagerService,
    private apiService:ApiService,
    private connectionService:ConnectionManagerService) { }

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

    // TODO! Checks compilation of stuff, emtpy for testing then everything will ned to be in here
    if ((this.hasPassword && this.uploadData.password&&this.uploadData.program)||(!this.hasPassword &&this.uploadData.program)){ 
    }
  
    // When first connection is established with apiService.connectToPlat, 
    // client will receive a JoinEvent (that will execute a onEvent)
    // and a MatchUpdate (that will execute a onMatchUpdate).

    // Executed on join event
    let onEvent = (type:LobbyEventType)=>{
    //TODO handle if connection aint established
    console.log("onEvent (join) was executed")
    this.currStep++;
    }

    // Executed on match update (you get a match update immediately after joining, as the #
    // of players has changed.)
    let onMatchUpdate = (matchInfo:MatchInfo)=>{
      console.log("onMatchUpdate (join) was executed")

      if (!this.lastMatchState){
        this.newMsg=""
      }
      else{ 
        // this finds the name of the new player that has joined.
        let newPlayer=""
        let pastConnected=this.lastMatchState.connected;
        let newConnected=matchInfo.connected=matchInfo.connected
        if(pastConnected.length < newConnected.length){
          newPlayer=newConnected.filter((item)=>pastConnected.indexOf(item))[0]
          this.newMsg=newPlayer+" has joined the match!";
        }
        else{
          newPlayer=pastConnected.filter((item)=>newConnected.indexOf(item))[0]
          this.newMsg=newPlayer+" has left the match!";
        }
      
      }
      this.lastMatchState=matchInfo;
    }
  
    this.apiService.connectToPlay(
    this.game!.id,
    this.connectionService.username,
    this.uploadData.password,
    onEvent,
    onMatchUpdate,
    undefined)
  }

  fileUpload(event:any){console.log(event)
    this.uploadData.program = event.target.files[0]
    this.currProgramName = this.uploadData.program.name
    console.log(this.uploadData)
  }

  
}
