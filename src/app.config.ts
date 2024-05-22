import { provideRouter } from '@angular/router';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { routes } from './app.routes';
import {
  CLIPBOARD_OPTIONS,
  ClipboardButtonComponent,
  provideMarkdown,
} from 'ngx-markdown';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideMarkdown({
      clipboardOptions: {
        provide: CLIPBOARD_OPTIONS,
        useValue: {
          buttonComponent: ClipboardButtonComponent,
        },
      },
    }),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideFirestore(() => getFirestore())
    ),
  ],
};
