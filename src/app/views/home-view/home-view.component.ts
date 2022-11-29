import { Component, OnInit } from '@angular/core';
import { GAMES } from 'mock-games';
import { Game } from 'src/app/Game';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnInit {
  gamelist:Game[] = GAMES;
  columns:string[]= ["Verified","ID","Game","Players","Spectators","Timeout","Password","Time",""]
  cols = [
    { field: 'verified', header: 'Verified' },
    { field: 'id', header: 'ID' },
    { field: 'game', header: 'Game' },
    { field: 'players', header: 'Players' },
    { field: 'spectators', header: 'Spectators' },
    { field: 'timeout', header: 'Timeout' },
    { field: 'password', header: 'Password' },
    { field: 'current', header: 'Time' },
    { field: ' ', header: ' ' }];

  constructor() { }

  ngOnInit(): void {
  }

}
