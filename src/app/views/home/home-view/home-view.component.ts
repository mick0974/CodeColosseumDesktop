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
        "Lobby", "roshambo", 2, 1, undefined, {"rounds": "23", "pace": "5"}, undefined, undefined,
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
  
      (new Promise(resolve => setTimeout(resolve, 5100))).then(() => api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 6200))).then(() => api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 7300))).then(() => api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 8400))).then(() => api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 9500))).then(() => api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 10600))).then(() => api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 11700))).then(() => api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 12800))).then(() => api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 13900))).then(() => api.play("ROCK\n"));
      (new Promise(resolve => setTimeout(resolve, 15000))).then(() => api.play("ROCK\n"));
  
    } else {
      api.gameDescription(
        "roshambo",
        (gameDescription)=>{
        console.log("gameDescription");
        console.log(gameDescription);
      });

      api.connectToSpectate(
        "3m41h0rn9meb4",
        (spectateJoined) => console.log("spectateJoined" + spectateJoined), 
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
