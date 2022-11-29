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

  constructor() { }

  ngOnInit(): void {
  }

}
