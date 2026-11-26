import { mergeApplicationConfig } from '@angular/core';
import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { AppComponent } from './app/app.component';
import { APP_CONFIG } from './app/app.config';
import { SERVER_ROUTES } from './app/app.routes.server';

const CONFIG = mergeApplicationConfig(APP_CONFIG, {
  providers: [provideServerRendering(withRoutes(SERVER_ROUTES))],
});

export default (context: BootstrapContext) => bootstrapApplication(AppComponent, CONFIG, context);
