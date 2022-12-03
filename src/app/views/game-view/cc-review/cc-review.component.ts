import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cc-review',
  templateUrl: './cc-review.component.html',
  styleUrls: ['./cc-review.component.scss']
})
export class CcReviewComponent implements OnInit {
  gameId:string="";


  constructor(private activatedroute:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
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
