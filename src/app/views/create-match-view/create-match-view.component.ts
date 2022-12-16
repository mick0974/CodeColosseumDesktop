import { Component, OnInit } from '@angular/core';
import { CREATE_GAMES } from 'mock-create-match';
import { GameParams } from 'src/app/services/api-service/api.service';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-create-match-view',
  templateUrl: './create-match-view.component.html',
  styleUrls: ['./create-match-view.component.scss']
})
export class CreateMatchViewComponent implements OnInit {
  password: string = '';
  serverpwd: string = '';
  submitted: boolean = false;
  
  public createMatchData:any={};
  gamedetails:any[] = CREATE_GAMES;
  isLoading:boolean = false;
  loading:boolean = true;
  stateOptions: any[]= [{icon: 'pi pi-bars', value: 'table'}, {icon: 'pi pi-th-large', value: 'card'}];
  view_mode: string = "card";
  hasGames:boolean=false;

  constructor(private uploadService:UploadService) { }
  
  ngOnInit(): void {
    console.log("[Homeview] Resetting create match...")
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
  onClickLabel(){
    console.log("Click of new match button label");
  }

}
