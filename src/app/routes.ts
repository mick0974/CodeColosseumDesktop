import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { ConnectViewComponent } from './views/connect-view/connect-view.component';
import { GameViewComponent } from './views/game-view/game-view.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { CcUploadComponent } from './views/game-view/cc-upload/cc-upload.component';
import { CcResultsComponent } from './views/game-view/cc-results/cc-results.component';
import { CcReviewComponent } from './views/game-view/cc-review/cc-review.component';
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
        path: 'game/:id',
        canActivate: [AuthGuard],
        component: GameViewComponent,
        children: [
            { path: '', redirectTo: 'upload', pathMatch: 'full' },
            { path: 'upload', component: CcUploadComponent, pathMatch: 'full'  },
            { path: 'results', component: CcResultsComponent, pathMatch: 'full'  },
            { path: 'review', component: CcReviewComponent, pathMatch: 'full'  }
        ]
    },

    { path: "**", redirectTo: "/connect" },
];