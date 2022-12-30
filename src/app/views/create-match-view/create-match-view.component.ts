import { Component, OnInit, EventEmitter } from '@angular/core';
import { CREATE_GAMES } from 'mock-create-match';
import { GameDescription, GameDetails, GameParams } from 'src/app/services/api-service/api.service';
import { UploadService } from 'src/app/services/upload.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-match-view',
  templateUrl: './create-match-view.component.html',
  styleUrls: ['./create-match-view.component.scss']
})
export class CreateMatchViewComponent implements OnInit {
  public name: string = '**The Big Bang Theory**';
  public text: string = 'Custom **Markdown in Angular** example!';
  password: string = '';
  serverpwd: string = '';
  submitted: boolean = false;
  arg_name: string[] = [];
  arg_value: string[] = [];
  game_name: string ='';
  //How can I get this value from the html
  //game.game_description.name?: string;
  game_players: number = 7;
  index:number = 0;
  public createMatchData:any = {};
  selectedGame:any = {};
  
  gamedetails:any[] = CREATE_GAMES;
  isLoading:boolean = false;
  loading:boolean = true;
  stateOptions: any[]= [{icon: 'pi pi-bars', value: 'table'}, {icon: 'pi pi-th-large', value: 'card'}];
  view_mode: string = "card";
  hasGames:boolean=false;
  gameDescription:string = '';
  constructor(private uploadService:UploadService, private readonly router: Router) { 
    
  }
  
  ngOnInit(): void {
    console.log("[Createview] Resetting create match...")
    this.uploadService.reset()

    //todo Loading table will probably have to be disabled if we refresh often 
    setTimeout(() => {
        this.gamedetails = CREATE_GAMES;
        this.loading = false;
    }, 1000);

    this.hasGames = this.gamedetails.length !== 0;
    
    /*let onSuccess = (gamedetails:GameDetails[])=>{ 
      this.loading=true;
      this.gamedetails = gamedetails;
      this.loading=false;
      this.hasGames = this.gamedetails.length !== 0;
      for(let i=0;i<this.gamedetails.length;i++){
        this.gamedetails[i].time=(this.gamedetails[i].time-Date.now()/1000);
      }
    }
    this.uploadService.gameDetailsList(onSuccess)
    //this.connectionManager.lobbyList1(onSuccess)
    */
  
  }
  
  lobbyChange(event: any){
    console.log(event);
    console.log(this.createMatchData);
  }
  tabPanelChange(event: any){
    console.log("Event on the tabPanel" + event);
    console.log(this.createMatchData);
  }
  getFormatTime(value:number):string{
    return ""+(value/60).toFixed(0)+":"+value%60;
  }
  
  public async createMatch(newMatch:GameDetails): Promise<void> {

    //await this.connectionManager.connect(this.connectData.server, this.connectData.username);
    //if (this.connectionManager.isConnected) {
    //} else {
      // TODO: Show error message
    //}
    this.uploadService.createNewLobby(newMatch);
    this.router.navigateByUrl("/home"); //poi credo sia la home ad aggiornare i game disponibili
    
  }
  onClickCreateMatch(game: any, index: number){
    this.selectedGame = game;
    console.log("SelectedGame name: ", this.selectedGame.game_description.game_name);
    console.log("Game players: ", this.gamedetails[index].game_params.players);
    console.log("Click of new match button");
    console.log("Arg name: ", this.gamedetails[index].args[0].name);
    console.log("Arg value", this.gamedetails[index].args[0].value);
    //console.log("Arg name: ", this.gamedetails[index].args[1].name);
    //console.log("Arg value", this.gamedetails[index].args[1].value);
   
    //doubt : do we check again with connection manager if the user is connected?
    if(this.createMatchData.lobby){
      console.log("Players of game = " + this.createMatchData.game_name + "is = "+ this.createMatchData.game_players);
      const newMatch: GameDetails= { 
        lobby_name: this.createMatchData.lobby,
        password: this.createMatchData.password,
        game_description:{
          game_name: this.gamedetails[index].game_description.game_name ,
          game_descr: this.gamedetails[index].game_description.game_descr
        },
        game_params: {  
          players:this.gamedetails[index].game_params.players,
          bots: this.gamedetails[index].game_params.bots,
          timeout: this.gamedetails[index].game_params.timeout,
        },
        args : this.gamedetails[index].args
      }
      this.createMatch(newMatch);
      return;
    }
    this.submitted= true;
  }
  onClickBack(){
    this.router.navigateByUrl("/home");
  }
  handleChange(event: any){
    var index = event.index;
    console.log("Index of tab that had an event: " + index);

  }
  
}
