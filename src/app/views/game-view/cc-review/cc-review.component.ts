import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-cc-review',
  templateUrl: './cc-review.component.html',
  styleUrls: ['./cc-review.component.scss']
})
export class CcReviewComponent implements OnInit {
  gameId:string="";


  constructor(private uploadService:UploadService,private router:Router) { }

  ngOnInit(): void {
    this.uploadService.redirectIfGameNotSet()    

  }
  
  navigateToPrevious() {
    this.router.navigate(['game/results'])
  }

}
