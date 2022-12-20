import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUpload } from 'primeng/fileupload';
import { UploadService } from 'src/app/services/upload.service';
import { ApiService } from 'src/app/services/api-service/api.service';
import { ConnectionManagerService } from 'src/app/services/connection-manager.service';
import { LobbyEventType } from 'src/app/services/api-service/api.service';
import { MatchInfo } from 'src/app/services/api-service/api.service';
@Component({
  selector: 'cc-upload',
  templateUrl: './cc-upload.component.html',
  styleUrls: ['./cc-upload.component.scss']
})
export class CcUploadComponent implements OnInit {

  gameId : string = "";
  hasPassword:boolean = true;
  myfile:any[] = [];
  submitted:boolean = false;
  currProgramName:string = "No uploaded file yet."

  stateOptions: any[]= [{value:'python',label:'Python'}, {value: 'cpp',label:'C++'}];



  lastMatchState!:MatchInfo;
  newMsg:string="";

  



 uploadData:any={};

  constructor(private router: Router,
    private uploadService:UploadService,
     private apiService:ApiService,
     private connectionService:ConnectionManagerService ) { }

  ngOnInit(): void {
    this.uploadData.programType = 'python'
    this.uploadService.redirectIfGameNotSet()   
    this.hasPassword = this.uploadService.getGame()?.password ?? false
    this.uploadData = {
      "password":"",
      "programType":"python",
    }
    
  }


  fileUpload(event:any){console.log(event)
    this.uploadData.program = event.target.files[0]
    this.currProgramName = this.uploadData.program.name
    console.log(this.uploadData)
  }


  navigateToNext() {
    // TODO REMOVE SKIPPING OF CHECKS (WAS DONE TO TEST FASTER)
    //if (this.hasPassword && this.uploadData.password&&this.uploadData.program)||(!this.hasPassword &&this.uploadData.program)){
     // this.uploadService.uploadData = this.uploadData;
     // console.log(this.uploadService.uploadData)


     if(!this.hasPassword){
      this.uploadData.password=undefined;
     }


     let onEvent = (type:LobbyEventType)=>{
      //TODO if connection aint established
      console.log("onEvent (join) was executed")
      //this.router.navigate(['game/play']);
      }
    
    let onMatchUpdate = (matchInfo:MatchInfo)=>{
      console.log("onMatchUpdate (join) was executed")

      if (!this.lastMatchState){
        this.newMsg=""
      }
      else{ //to be tested!
        let newPlayer=""
      
       // this finds the name of the new player that has joined.

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
      this.uploadService.game!.id,
      this.connectionService.username,
      this.uploadData.password,
      onEvent,
      onMatchUpdate,
      undefined)


    //}

    if (this.uploadData.password) {
      this.router.navigate(['game/play'])
      return;
    }

  this.submitted = true;
  
  }

}
