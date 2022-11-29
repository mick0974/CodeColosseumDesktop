import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElectronBridgeService {
  pipeTest = new Subject<string>();

  constructor() { 
    (<any>window).api.receive('pipeTest', (pipe: any) => {
      console.log(pipe);
      this.pipeTest.next(pipe);
    });

  }
}

