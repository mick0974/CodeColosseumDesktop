import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { ConnectViewComponent } from './views/connect-view/connect-view.component';
import { GameViewComponent } from './views/game-view/game-view.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { CcUploadComponent } from './views/game-view/cc-upload/cc-upload.component';
import { CcPlayComponent } from './views/game-view/cc-play/cc-play.component';
import { CcReviewComponent } from './views/game-view/cc-review/cc-review.component';
import { SpectateViewComponent } from './views/spectate-view/spectate-view/spectate-view.component';
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
            { path: 'play', component: CcPlayComponent, pathMatch: 'full'  },
            { path: 'review', component: CcReviewComponent, pathMatch: 'full'  }
        ]
    },
    {
        path: 'spectate/:id',
        canActivate: [AuthGuard],
        component: SpectateViewComponent,
    }
/*
    { path: "**", redirectTo: "/connect" },*/
];