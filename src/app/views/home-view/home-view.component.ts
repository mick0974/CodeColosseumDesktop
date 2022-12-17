import { Component, OnInit } from '@angular/core';
import { MatchInfo } from 'src/app/services/api.service';
import { ConnectionManagerService } from 'src/app/services/connection-manager.service';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnInit {
  gamelist:MatchInfo[]=[];
  isLoading:boolean = false;
  loading:boolean = true;
  stateOptions: any[]= [{icon: 'pi pi-bars', value: 'table'}, {icon: 'pi pi-th-large', value: 'card'}];
  view_mode: string = "card";
  hasGames:boolean=false;

  constructor(private uploadService:UploadService, private connectionManager:ConnectionManagerService) { }

  ngOnInit(): void {

    console.log("[Homeview] Resetting gameplay...")
    this.uploadService.reset()

    this.lobbyList()
  }

  async lobbyList() {
   
    let dateTime = new Date()
    await this.connectionManager.lobbyList()
    console.log(this.connectionManager.lobbylistvar)
    this.gamelist = this.connectionManager.lobbylistvar ?? []
    this.hasGames = this.gamelist.length !== 0;


    for(let i=0;i<this.gamelist.length;i++){
      this.gamelist[i].time=(this.gamelist[i].time-Date.now()/1000)

    }


  
  }



  getFormatTime(value:any):string{
    console.log(value)
    return "a"
  }
  async onClickRefresh(){
    await this.lobbyList()
    console.log("homeview:")
    console.log(this.gamelist[0])
  }
}
