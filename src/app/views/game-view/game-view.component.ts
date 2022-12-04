import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/Game';
import { GAMES } from 'mock-games';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { UploadService } from 'src/app/services/upload.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent implements OnInit {
  gameExists : boolean = false;
  gameId : string= this.uploadService.getGameId() ;
  game! : Game | null;
  currStep : number = 0;
  
  items: MenuItem[]= [
    {label: 'Match setup', routerLink: ['upload']},
    {label: 'Match results', routerLink:['results']},
    {label: 'Match review', routerLink:['review']}
];


  constructor(private router:Router,private activatedroute:ActivatedRoute, private uploadService:UploadService) { }

  ngOnInit(): void {

    //TODO: redirect to a 404 page rather than displaying the message here
    
    let token = this.activatedroute.snapshot.paramMap.get('id');

    if (token){
      this.uploadService.setGame(token);
      console.log("[Gameview] Setting game! Redirecting...")
      this.router.navigate(['game'])
  }
    else{
      if (this.uploadService.isGameSet()){
        console.log("[Gameview] Game was already set to "+this.uploadService.getGameId())
        this.router.navigate(['game/upload'])
      }
      else{
        console.log("[Gameview] Game was not set! ")
        //this.router.navigateByUrl("/home")
      }
    }

    
  }


  
}
