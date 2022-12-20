import { Component, OnInit, EventEmitter } from '@angular/core';
import { CREATE_GAMES } from 'mock-create-match';
import { GameParams } from 'src/app/services/api-service/api.service';
import { UploadService } from 'src/app/services/upload.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-match-view',
  templateUrl: './create-match-view.component.html',
  styleUrls: ['./create-match-view.component.scss']
})
export class CreateMatchViewComponent implements OnInit {
  password: string = '';
  serverpwd: string = '';
  submitted: boolean = false;
  arg_name: string[] = [];
  arg_value: string[] = [];
  game_name: string ='';
  //How can I get this value from the html
  //game.game_description.name?: string;
  game_players: number = 7;

  public createMatchData:any = {};
  
  gamedetails:any[] = CREATE_GAMES;
  isLoading:boolean = false;
  loading:boolean = true;
  stateOptions: any[]= [{icon: 'pi pi-bars', value: 'table'}, {icon: 'pi pi-th-large', value: 'card'}];
  view_mode: string = "card";
  hasGames:boolean=false;
  gameDescription:string = '';
  constructor(private uploadService:UploadService, private readonly router: Router) { }
  
  ngOnInit(): void {
    console.log("[Createview] Resetting create match...")
    this.uploadService.reset()

    //todo Loading table will probably have to be disabled if we refresh often 
    setTimeout(() => {
        this.gamedetails = CREATE_GAMES;
        this.loading = false;
    }, 1000);

    this.hasGames = this.gamedetails.length !== 0;
  
  }
  
  lobbyChange(event: any){
    console.log(event);
    console.log(this.createMatchData);
  }
  
  getFormatTime(value:number):string{
    return ""+(value/60).toFixed(0)+":"+value%60;
  }
  onClickCreateMatch(){
    console.log("Click of new match button");
    //doubt : do we check again with connection manager if the user is connected?
    
    if(this.createMatchData.lobby){
      console.log("Players of game = " + this.createMatchData.game_name + "is = "+ this.createMatchData.game_players);
      const newMatch= { 
        players:this.createMatchData.game_players,
        bots:1,
        timeout:10.0,
        args : {},//{this.createMatchData.arg_name: this.createMatchData.arg_value},
        id: "hHhtyyGg",
        name: this.createMatchData.lobby,
        game: this.createMatchData.game_name,
        running: false,
        time: 0,
        connected: {},
        spectators: 0,
        password: this.createMatchData.password,
        verified: this.createMatchData.serverpwd
      }
      this.router.navigateByUrl("/home");
      return;
    }
    this.submitted= true;
  }
  handleChange(event: any){
    var index = event.index;
    console.log("Index of tab that had an event: " + index);
    console.log("Name of match in the tab : "+this.createMatchData.game_name);
  }
}
