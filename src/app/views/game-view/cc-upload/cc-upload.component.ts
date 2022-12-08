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
  currProgramName:string = "No uploaded file yet."

  stateOptions: any[]= [{value:'python',label:'Python'}, {value: 'cpp',label:'C++'}];



  uploadData:any={};

  constructor(private router: Router,private uploadService:UploadService ) { }

  ngOnInit(): void {
    this.uploadData.programType = 'python'
    this.uploadService.redirectIfGameNotSet()   
    this.hasPassword = this.uploadService.getGame()?.password ?? false
    this.uploadData = {
      "password":"",
      "programType":"python",
    }
  }


  fileUpload(event:any){console.log(event)
    this.uploadData.program = event.target.files[0]
    this.currProgramName = this.uploadData.program.name
    console.log(this.uploadData)
  }


  navigateToNext() {
    if (this.hasPassword && this.uploadData.password&&this.uploadData.program){
      this.uploadService.uploadData = this.uploadData;
      console.log(this.uploadService.uploadData)
      this.router.navigate(['game/results']);
    }

    this.submitted = true;
  
  }

}