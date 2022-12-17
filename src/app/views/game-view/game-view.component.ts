import { Component, OnInit } from '@angular/core';
import { MatchInfo } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { UploadService } from 'src/app/services/upload.service';
import { Router } from '@angular/router';
import { ConnectionManagerService } from 'src/app/services/connection-manager.service';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent implements OnInit {

  game! : MatchInfo | null;

  gameId : string= "" ;
  gameName : string = "";
  
  currStep : number = 0;
  
  items: MenuItem[]= [
    {label: 'Match setup', routerLink: ['upload']},
    {label: 'Match results', routerLink:['play']},
    {label: 'Match review', routerLink:['review']}
];


  constructor(private router:Router,private activatedroute:ActivatedRoute, private uploadService:UploadService) { }

  ngOnInit(): void {

    //TODO: redirect to a 404 page rather than immediate redirect


    /*The flow here is:
    
    User clicks on play
     --> go to /game/set/<id> 
     --> this component catches it and sets the id in service
     --> this components redirects to /game
     --> this component checks if id was set or not
       --> if id was set, redirect to /upload
       --> if not, redirect to home

    User tries to access game screen directly through URL
    --> this component catches it and checks if id was set
      --> if yes, everything's fine
      --> if na, redirect to home
    
      // todo: if user accesses /game/upload with no id set, redirect to home. Might be worth it to move all these controls inside the service?
    */
    
    let token = this.activatedroute.snapshot.paramMap.get('id');

    if (token){
      console.log("1.SET")
      this.uploadService.setGame1(token).then(
        ()=>{ // Asks APIs for list and saves game if exists
          console.log(this.uploadService.isGameSet());
          console.log(this.uploadService.game);
          this.game = this.uploadService.game;
          this.gameId = this.uploadService.game?.id ?? "";
          this.gameName = this.game?.name ?? "";
          this.router.navigate(['game'])
        }
      )

    } 
    else{
      console.log("2.check")
      if (this.uploadService.isGameSet()){
        console.log("[Gameview] Gameplay was already set to "+this.uploadService.game!.id +". Loading upload view...")
        this.router.navigate(['game/upload'])
        this.game = this.uploadService.game;
        this.gameId = this.uploadService.game?.id ?? "";
        this.gameName = this.game?.name ?? "";
      }
      else{
        console.log("[Gameview] Game was not set! Redirecting to Homeview. ")
        this.router.navigate(['home'])
      }
    }



  }



  
}
