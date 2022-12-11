import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-match-view',
  templateUrl: './create-match-view.component.html',
  styleUrls: ['./create-match-view.component.scss']
})
export class CreateMatchViewComponent implements OnInit {
  password: string = '';
  submitted: boolean = false;
  
  public createMatchData:any={};
  
  constructor() { }

  ngOnInit(): void {
  }
  
  lobbyChange(event: any){
    console.log(event);
    console.log(this.createMatchData);
  }

}
