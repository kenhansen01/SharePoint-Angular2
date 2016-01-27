/// <reference path="../../scripts/typings/sharepoint/sharepoint.d.ts" />
import {AppComponent} from './app.component';
import {bootstrap} from 'angular2/platform/browser';
import {provide, enableProdMode} from 'angular2/core';
import {ROUTER_PROVIDERS, RouteConfig, Location, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {RequestService} from 'request.service';

enableProdMode();

bootstrap(AppComponent, [
  RequestService,
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS,
  provide(LocationStrategy, { useClass: HashLocationStrategy })
]);