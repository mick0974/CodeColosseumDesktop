import { Component, OnInit } from '@angular/core';
import { CREATE_GAMES } from 'mock-create-match';
import { GameDetails } from 'src/app/services/api-service/api.service';
import { UploadService } from 'src/app/services/upload.service';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api-service/api.service';

@Component({
  selector: 'app-create-match-view',
  templateUrl: './create-match-view.component.html',
  styleUrls: ['./create-match-view.component.scss']
})
export class CreateMatchViewComponent implements OnInit {
  public name: string = '**The Big Bang Theory**';
  public text: string = 'Custom **Markdown in Angular** example!';
  password: string = '';
  // is not necessary serverpwd: string = '';
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
  
  showDesc:boolean = false;
  
  gameNameList:string[] = [];
  gameDescriptionList:string[] = [];
  gamedetails:any[] = CREATE_GAMES;
  isLoading:boolean = false;
  loading:boolean = true;
  stateOptions: any[]= [{icon: 'pi pi-bars', value: 'table'}, {icon: 'pi pi-th-large', value: 'card'}];
  view_mode: string = "card";
  hasGames:boolean=false;
  gameDescription:string = '';

  public createError = "";
  waiting = false;

  apiService = new ApiService();

  constructor(private uploadService:UploadService, private readonly router: Router) { 
    
  }

  getNameFromDescr(gameDescription:string) {
    let name = gameDescription.split(" ")[1];
    return name;
  }

  replaceImageCode(gameDescription:string) {
    let descr;
    // ! THIS HAS BEEN PUT IN THE CLIENT BY HAND AS THERE IS NO PROGRAMMATIC
    // ! WAY OF DOWNLOADING IMAGES FROM THE SERVER. SHOULD MORE GAMES BE ADDED, 
    // ! A WAY TO PROGRAMMATICALLY DOWNLOAD IMAGES SHOULD BE ADDED TO THE SERVER
    // ! (OR THE IMAGES WILL ALL NEED TO BE MANUALLY IMPORTED BY YOU PROGRAMMERS
    // ! FOR EACH GAME)
    // ! vvv
    descr = gameDescription.replace("{{#include royalur-board.svg}}", '<br><br><img src="../../assets/images/royalur-board.svg" alt="royalur" width="276"><br><br>'); 
    // ! ^^^

    descr = descr.replaceAll("\\(", "(");
    descr = descr.replaceAll("\\)", ")");

    //console.log(descr.search("\\("));

    return descr;
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
    
    let onSuccess = (gameNameList:string[])=>{ 
      this.loading=true;
      this.gameNameList = gameNameList;
      this.loading=false;
      this.hasGames = this.gameNameList.length !== 0;

      let onSuccess1 = (gameDescription:string) => { 
        this.hasGames = this.gameNameList.length !== 0;
        this.gameDescriptionList[this.gameDescriptionList.length] = gameDescription;
        //console.log(gameDescription);
        //console.log(this.gameDescriptionList);

        this.gamedetails.forEach((gameDetail:GameDetails) => {
          let gameName = this.getNameFromDescr(gameDescription);

          if(gameDetail.game_description!.game_name === gameName) {
            gameDetail.game_description!.game_descr = this.replaceImageCode(gameDescription);
          }
        });
      }

      this.gameNameList.forEach((gameName:string) => {
        this.uploadService.apiGameDescription1(gameName, onSuccess1);
      });
      /*for(let i=0;i<this.gameNameList.length;i++){
        this.gameNameList[i].time=(this.gameNameList[i].time-Date.now()/1000);
      }*/
    }
    this.uploadService.apiGameList1(onSuccess);
    
    /*
    for(let i=0; i < this.gameNameList.length;i++){
      let onSuccess1 = (gameDescription:string) => { 
        this.hasGames = this.gameNameList.length !== 0;
        this.gameDescriptionList[this.gameDescriptionList.length] = gameDescription;
        console.log("description");
        console.log(this.gameDescriptionList);
      }
      this.uploadService.apiGameDescription1(this.gameNameList[i], onSuccess1);
    }
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
    let onSuccess = (newGame:string) => {
      console.log("New lobby successfully created: " + newGame);
      this.createError = "";
      this.router.navigateByUrl("/home"); //home will update the list of lobby with new lobby name
    }
    let onError = (reason:any)=>{
      console.log("Error, could not create new lobby: " + reason);
      this.createError = reason;
      
    }
    this.apiService.createNewLobby(onSuccess, onError, newMatch);
      this.waiting = false; // hides the loading wheel as server operations have ended
  }

  onClickCreateMatch(game: any, index: number){
    this.selectedGame = game;
    
    if(this.createMatchData.lobby){
      console.log("Players of game = " + this.createMatchData.game_name + "is = "+ this.createMatchData.game_players);
      const newMatch: GameDetails= { 
        lobby_name: this.createMatchData.lobby,
        password: this.createMatchData.password,
        verification: this.createMatchData.serverpwd,
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
      this.waiting=true; //shows the loading wheel
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

  toggleDesc(){
    this.showDesc = !this.showDesc;
  }

  resetPassword(){
    this.createMatchData.password=undefined;
  }
  resetVerified(){
    this.createMatchData.serverpwd=undefined;
  }

}
