import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-game-view',
  templateUrl: './create-game-view.component.html',
  styleUrls: ['./create-game-view.component.scss']
})
export class CreateGameViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  onClick(){
    console.log('Click event');
  }
}
