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

    api.gameNew((gameNew) => {
      console.log(gameNew)
    }, "Lobby", "roshambo");

    api.lobbyList((lobbyList) => {
      console.log(lobbyList)
    }, (error) => {
      alert("error 3")
    });
  }

}
