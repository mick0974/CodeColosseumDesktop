import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cc-upload',
  templateUrl: './cc-upload.component.html',
  styleUrls: ['./cc-upload.component.scss']
})
export class CcUploadComponent implements OnInit {

  gameId : string = "";
  uploadedFiles:any[]=[];

  constructor(private router: Router,private activatedroute:ActivatedRoute ) { }

  ngOnInit(): void {

    
  }

  uploadFile(event:Event){
    console.log(event)
  }



  navigateToNext() {
    // TODO: check if token is fine, if not redirect or smth
    // TODO: probably worth it to just use a service to check the current game, rather than URl path
    if(this.activatedroute.parent){
      let token = this.activatedroute.parent.snapshot.paramMap.get('id');
      if (token){
      this.gameId = token;
      this.router.navigate(['/game/'+this.gameId+'/results'])
      }
    }
  }



}
