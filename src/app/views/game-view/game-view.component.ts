import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/Game';
import { GAMES } from 'mock-games';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent implements OnInit {
  gameExists : boolean = false;
  gameId : string="" ;
  game! : Game | null;
  currStep : number = 0;
  
  items: MenuItem[]= [
    {label: 'Step 1', routerLink: ['upload']},
    {label: 'Step 2', routerLink:['results']},
    {label: 'Step 3', routerLink:['review']}
];


  constructor(private activatedroute:ActivatedRoute) { }

  ngOnInit(): void {

    //TODO: redirect to a 404 page rather than displaying the message here
    let token = this.activatedroute.snapshot.paramMap.get('id');

    if (token){
      this.gameId=token;
      // This has to be substituted with getting the game from the API
      GAMES.find( (g) => (this.game = g.id === this.gameId ? g : null) )
    }

    
  }


  
}
