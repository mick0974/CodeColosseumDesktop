import { Component, OnInit } from '@angular/core';
import { GAMES } from 'mock-games';
import { Game } from 'src/app/Game';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnInit {
  gamelist:Game[] = GAMES;
  isLoading:boolean = false;
  loading:boolean = true;
  stateOptions: any[]= [{icon: 'pi pi-bars', value: 'table'}, {icon: 'pi pi-th-large', value: 'card'}];
  view_mode: string = "card";

  constructor(private uploadService:UploadService) { }

  ngOnInit(): void {

    console.log("[Homeview] Resetting gameplay...")
    this.uploadService.reset()

    
        setTimeout(() => {
            this.gamelist = GAMES;
            this.loading = false;
        }, 1000);
  }

  getFormatTime(value:number):string{
    return ""+(value/60).toFixed(0)+":"+value%60;
  }

}
