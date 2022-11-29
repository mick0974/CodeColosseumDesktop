import { Component, OnInit } from '@angular/core';
import { ElectronBridgeService } from 'src/app/services/electron-bridge.service';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnInit {

  constructor(
    private electronBridgeSrv: ElectronBridgeService
  ) { 
    this.electronBridgeSrv.pipeTest.subscribe();
  }

  ngOnInit(): void {
  }

}
