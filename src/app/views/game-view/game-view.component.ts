import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/Game';
import { GAMES } from 'mock-games';
import { ActivatedRoute } from '@angular/router';
import {TimelineModule} from 'primeng/timeline';

import {PrimeIcons} from 'primeng/api';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent implements OnInit {
  gameExists : boolean = false;
  gameId : string="" ;
  game! : Game | null;
  items : any;


  constructor(private activatedroute:ActivatedRoute) { }

  ngOnInit(): void {

    let token = this.activatedroute.snapshot.paramMap.get('id');

    if (token){
      this.gameId=token;
      // This has to be substituted with getting the game from the API
      GAMES.find( (g) => (this.game = g.id === this.gameId ? g : null) )

    }

    

      this.items = [
        {label: 'Step 1'},
        {label: 'Step 2'},
        {label: 'Step 3'}
    ];

      
  }

}
