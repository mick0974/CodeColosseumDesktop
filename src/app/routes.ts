import { Routes } from '@angular/router';
import { DemoViewComponent } from './views/demo-view/demo-view.component';

export const routes: Routes = [
    { path: '', redirectTo: '/demo', pathMatch: 'full' },
    { path: 'demo', component: DemoViewComponent },
];