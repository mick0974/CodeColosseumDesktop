import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { ConnectViewComponent } from './views/connect-view/connect-view.component';
import { GameViewComponent } from './views/game-view/game-view.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { CcUploadComponent } from './views/game-view/cc-upload/cc-upload.component';
import { CcResultsComponent } from './views/game-view/cc-results/cc-results.component';
import { CcReviewComponent } from './views/game-view/cc-review/cc-review.component';
import {CreateGameViewComponent} from './views/create-game-view/create-game-view.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/connect',
        pathMatch: 'full'
    },
    {
        path: 'connect',
        component: ConnectViewComponent
    },
    {
        path: 'home',
        canActivate: [AuthGuard],
        component: HomeViewComponent
    },
    {
        path: 'game/set/:id',
        canActivate: [AuthGuard],
        component: GameViewComponent,
        
    },
    {
        path: 'game',
        canActivate: [AuthGuard],
        component: GameViewComponent,
        children: [
            { path: 'upload', component: CcUploadComponent, pathMatch: 'full'  },
            { path: 'results', component: CcResultsComponent, pathMatch: 'full'  },
            { path: 'review', component: CcReviewComponent, pathMatch: 'full'  }
        ]
    },{
        path: 'newgame',
        canActivate: [AuthGuard],
        component: CreateGameViewComponent,
    }

/*
    { path: "**", redirectTo: "/connect" },*/
];