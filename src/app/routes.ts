import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { ConnectViewComponent } from './views/connect-view/connect-view.component';
import { GameViewComponent } from './views/game-view/game-view.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { SpectateViewComponent } from './views/spectate-view/spectate-view/spectate-view.component';
import { CreateMatchViewComponent } from './views/create-match-view/create-match-view.component';
import { AboutViewComponent } from './views/about-view/about-view.component';

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
    },{
        path:'game/:id',
        canActivate: [AuthGuard],
        component: GameViewComponent
    },
    {
        path: 'newmatch',
        canActivate: [AuthGuard],
        component: CreateMatchViewComponent,
    },
    {
        path: 'spectate/:id',
        canActivate: [AuthGuard],
        component: SpectateViewComponent,
    },
    {
        path: 'about',
        component: AboutViewComponent,
    }
];