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
    let type = "spectate";
    
    api.gameList((gameList)=>{
      console.log(gameList);
    });

    if(type === "play") {
      api.createNewGame((gameNew) => {
        console.log('New game created: ' + gameNew);
        api.connectToPlay(
          (lobbyData) => console.log(lobbyData), 
          (lobbyUpdated) => console.log(lobbyUpdated),
          (matchStarted) => console.log(matchStarted),
          (binaryInfo) => console.log(binaryInfo),
          (matchEnded) => console.log(matchEnded),
          gameNew, "Lollo123", undefined, 
          (error) => alert(error));
      }, "Lobby", "roshambo", 2, 1, undefined, undefined, undefined, undefined, (error) => {
        alert("error 3");
      });
  
      (new Promise(resolve => setTimeout(resolve, 5000))).then(() => api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 6000))).then(() => api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 7000))).then(() => api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 8000))).then(() => api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 9000))).then(() => api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 10000))).then(() => api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 11000))).then(() => api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 12000))).then(() => api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 13000))).then(() => api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 14000))).then(() => api.play("ROCK\n"));
  
    } else {
      api.connectToSpectate(
        (spectateJoined) => console.log(spectateJoined), 
        (spectateStarted) => console.log(spectateStarted),
        (spectatSynced) => console.log(spectatSynced),
        (lobbyUpdated) => console.log(lobbyUpdated),
        (binaryMessage) => console.log(binaryMessage),
        (spectateEnded) => console.log(spectateEnded),
        "3m41h0rn9meb4"
      ); 
    }

  }

}
