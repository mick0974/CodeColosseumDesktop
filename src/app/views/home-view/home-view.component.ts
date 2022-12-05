import { Component, OnInit, NgZone } from '@angular/core';
import { GAMES } from 'mock-games';
import { Game } from 'src/app/Game';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnInit {
  gamelist: Game[] = GAMES;
  isLoading: boolean = false;
  loading: boolean = true;
  stateOptions: any[] = [{ icon: 'pi pi-bars', value: 'table' }, { icon: 'pi pi-th-large', value: 'card' }];
  view_mode: string = "table";

  constructor(
    public zone: NgZone
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.gamelist = GAMES;
      this.loading = false;
    }, 1000);
  }
}

function ngOnInit() {
  throw new Error('Function not implemented.');
}

