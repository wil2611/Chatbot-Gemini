import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import 'zone.js';
import { appConfig } from './app.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet />
  `,
})
export class App {}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
