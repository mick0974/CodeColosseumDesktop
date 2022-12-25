import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';
import { routes } from './routes';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { ConnectViewComponent } from './views/connect-view/connect-view.component';
import { GameViewComponent } from './views/game-view/game-view.component';


import { InputTextModule } from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { StepsModule } from 'primeng/steps';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MenuModule } from 'primeng/menu';
import {InplaceModule} from 'primeng/inplace';
import {TabViewModule} from 'primeng/tabview';
import {InputNumberModule} from 'primeng/inputnumber';
import {ProgressSpinnerModule} from 'primeng/progressspinner';

import { ReactiveFormsModule } from '@angular/forms';
import { CreateMatchViewComponent } from './views/create-match-view/create-match-view.component';
import { CcChatComponent } from './components/cc-chat/cc-chat.component';
import { SpectateViewComponent } from './views/spectate-view/spectate-view/spectate-view.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeViewComponent,
    ConnectViewComponent,
    GameViewComponent,
    CreateMatchViewComponent,
    CcChatComponent,
    SpectateViewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    InputTextModule,
    PasswordModule,
    InputSwitchModule,
    DropdownModule,
    StepsModule,
    FileUploadModule,
    ConfirmPopupModule,
    TooltipModule,
    TableModule,
    TagModule,
    ScrollPanelModule,
    RippleModule,
    SelectButtonModule,
    MenuModule,
    ReactiveFormsModule,
    HttpClientModule,
    InplaceModule,
    TabViewModule,
    InputNumberModule,
    ProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
