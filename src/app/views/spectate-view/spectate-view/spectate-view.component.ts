import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-spectate-view',
  templateUrl: './spectate-view.component.html',
  styleUrls: ['./spectate-view.component.scss']
})
export class SpectateViewComponent implements OnInit {

  gameId:string=""

  constructor(private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.gameId = this.activatedRoute.snapshot.params['id'];
  }

}
