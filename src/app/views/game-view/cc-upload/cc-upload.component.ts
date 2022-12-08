import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUpload } from 'primeng/fileupload';
import { UploadService } from 'src/app/services/upload.service';
@Component({
  selector: 'cc-upload',
  templateUrl: './cc-upload.component.html',
  styleUrls: ['./cc-upload.component.scss']
})
export class CcUploadComponent implements OnInit {

  gameId : string = "";
  hasPassword:boolean = true;
  myfile:any[] = [];
  submitted:boolean = false;

  uploadData:any={};

  constructor(private router: Router,private uploadService:UploadService ) { }

  ngOnInit(): void {
    this.uploadService.redirectIfGameNotSet()   
    this.hasPassword = this.uploadService.getGame()?.password ?? false
    this.uploadData = {
      "password":""
    }
  }


  fileUpload(event:any){console.log(event)
    console.log(this.uploadData)
    this.uploadData.program = event.target.files[0]
    console.log(this.uploadData)
  }


  navigateToNext() {
    if (this.hasPassword && this.uploadData.password&&this.uploadData.program){
      this.uploadService.uploadData = this.uploadData;
      this.router.navigate(['game/results']);
    }

    this.submitted = true;
  
  }

}