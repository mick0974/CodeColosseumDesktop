import { Component, OnInit } from '@angular/core';
import { MatchInfo } from 'src/app/services/api.service';
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
  gameName : string = this.uploadService.getGameName();
  game! : MatchInfo | null;
  currStep : number = 0;
  
  items: MenuItem[]= [
    {label: 'Match setup', routerLink: ['upload']},
    {label: 'Match results', routerLink:['play']},
    {label: 'Match review', routerLink:['review']}
];


  constructor(private router:Router,private activatedroute:ActivatedRoute, private uploadService:UploadService) { }

  ngOnInit(): void {

    //TODO: redirect to a 404 page rather than displaying the message in the same page


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
      this.uploadService.setGame(token);
      console.log("[Gameview] Gameplay set to "+this.uploadService.getGameId()+"! Reloading...")
      this.router.navigate(['game'])
  }
    else{
      if (this.uploadService.isGameSet()){
        console.log("[Gameview] Gameplay was already set to "+this.uploadService.getGameId()+". Loading upload view...")
        this.router.navigate(['game/upload'])
      }
      else{
        console.log("[Gameview] Game was not set! Redirecting to Homeview. ")
        this.router.navigate(['home'])
      }
    }

    
  }


  
}
