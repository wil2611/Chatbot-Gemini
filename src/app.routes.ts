import { Routes } from '@angular/router';
import { WelcomeComponent } from './app/welcome/welcome.component';
import { ChatComponent } from './app/chat/chat.component';

export const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'chat',
    component: ChatComponent,
  },
];
