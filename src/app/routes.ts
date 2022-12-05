import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { ConnectViewComponent } from './views/connect-view/connect-view.component';
import { DemoViewComponent } from './views/demo-view/demo-view.component';
import { GameViewComponent } from './views/game-view/game-view.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { RouterViewComponent } from './views/router-view/router-view.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/router',
        pathMatch: 'full'
    },
    {
        path: 'router',
        component: RouterViewComponent
    },
    {
        path: 'demo',
        component: DemoViewComponent
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
        path: 'game',
        canActivate: [AuthGuard],
        component: GameViewComponent
    },
    { path: "**", redirectTo: "/connect" },
];