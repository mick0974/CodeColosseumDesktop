import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/demo', pathMatch: 'full' },
    { path: 'demo', loadChildren: () => import('./views/demo-view/demo-view/demo-view.component').then(m => m.HomeModule) },
];