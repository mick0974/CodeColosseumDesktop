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
    let type = "play";

    api.gameList((gameList)=>{
      console.log(gameList);
    }, (error)=>{
      console.log(error);
    });

    if(type === "play") {
      api.createNewLobby(
        "Lobby", "roshambo", 2, 1, undefined, undefined, undefined, undefined,
        (gameNew) => {
        console.log('New game created: ' + gameNew);
        api.connectToPlay(
          gameNew, "Lollo123", undefined,
          (lobbyData) => console.log(lobbyData), 
          (lobbyUpdated) => console.log(lobbyUpdated),
          () => console.log(),
          (binaryInfo) => console.log(binaryInfo),
          () => console.log(),
          undefined,
          (error) => alert(error));
      }, undefined, (error) => {alert("error 3");
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
  
    } else if(type === "spectate") {
      api.gameDescription(
        "roshambo",
        (gameDescription)=>{
        console.log(gameDescription);
      });

      api.connectToSpectate(
        "3p8c4br4d6jha",
        (spectateJoined) => console.log(spectateJoined), 
        () => console.log(),
        () => console.log(),
        (lobbyUpdated) => console.log(lobbyUpdated),
        (binaryMessage) => console.log(binaryMessage),
        () => console.log(),
        (apiError) => console.log("apiError: " + apiError)
      ); 
    }

  }

}
