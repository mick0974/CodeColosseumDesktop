import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadService } from 'src/app/services/upload.service';
@Component({
  selector: 'cc-upload',
  templateUrl: './cc-upload.component.html',
  styleUrls: ['./cc-upload.component.scss']
})
export class CcUploadComponent implements OnInit {

  gameId : string = "";
  hasPassword:boolean = true;
  uploadedFiles:any[]=[];

  constructor(private router: Router,private uploadService:UploadService ) { }

  ngOnInit(): void {
    this.uploadService.redirectIfGameNotSet()    
    /*this.gameId = this.uploadService.getGameId;
    if(this.uploadService.getGame())
      this.hasPassword = this.uploadService.getGame().*/
      }

  uploadFile(event:Event){
    console.log(event)
  }



  navigateToNext() {
    this.router.navigate(['game/results'])
  }



}
