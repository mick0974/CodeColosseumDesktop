import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'tal-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    alert("API is available");
    let api = new ApiService();
    
    
    api.gameList((gameList)=>{
      console.log(gameList);
    });
    

    api.createNewGame((gameNew) => {
      console.log('New game created: ' + gameNew);
      api.connect((lobbyData) => {
        console.log(lobbyData);
      }, 
      (lobbyUpdated) => console.log(lobbyUpdated),
      (matchStarted) => console.log(matchStarted),
       gameNew, "Lollo123",
      undefined, (error) => {
        alert(error);
      });
    }, "Lobby", "roshambo", 2, 1, undefined, undefined, undefined, undefined, (error) => {
      alert("error 3");
    });

    api.createNewGame
  }

}
