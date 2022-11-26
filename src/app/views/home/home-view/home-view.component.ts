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
    
    /*
    api.gameList((gameList)=>{
      console.log(gameList);
    });
    */

    api.createNewGame((gameNew) => {
      api.connect((lobbyData) => {
        console.log("lobbyData: ");
        console.log(lobbyData);
      }, 
      (lobbyUpdated) => console.log("LobbyUpdated: " + lobbyUpdated), gameNew, "Lollo123");
    }, "Lobby", "roshambo", 2, undefined, undefined, undefined, undefined, undefined, (error) => {
      alert("error 3")
    });

    /*
    api.lobbyList((lobbyList) => {
      console.log(lobbyList)
    }, (error) => {
      alert("error 3")
    });
    */
  }

}
