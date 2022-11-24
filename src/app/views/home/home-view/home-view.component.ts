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
      //alert(gameList);
    });

    api.gameNew((gameNew) => {
      console.log(gameNew)
    }, "roshambo", "PorcoRonco");

    api.lobbyList((lobbyList) => {
      console.log(lobbyList.forEach(prop => console.log(prop)))
    });
  }

}
