import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-cc-results',
  templateUrl: './cc-results.component.html',
  styleUrls: ['./cc-results.component.scss']
})
export class CcResultsComponent implements OnInit {

  gameId:string = "";


  constructor(private router:Router,private activatedroute:ActivatedRoute) { }

  ngOnInit(): void {
  }

  navigateToNext() {   
    if(this.activatedroute.parent){
      let token = this.activatedroute.parent.snapshot.paramMap.get('id');
      if (token){
        this.gameId = token;
        this.router.navigate(['/game/'+this.gameId+'/review'])
      }
    }
  }

  navigateToPrevious() {
    if(this.activatedroute.parent){
      let token = this.activatedroute.parent.snapshot.paramMap.get('id');
      if (token){
      this.gameId = token;
      this.router.navigate(['/game/'+this.gameId+'/upload'])
      }
    }
  }
}
