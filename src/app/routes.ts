import { Routes } from '@angular/router';
import { DemoViewComponent } from './views/demo-view/demo-view.component';

export const routes: Routes = [
    { path: '', redirectTo: '/demo', pathMatch: 'full' },
    { path: 'demo', loadChildren: () => import('./views/demo-view/demo-view.component').then(m => m.DemoViewComponent) },
];