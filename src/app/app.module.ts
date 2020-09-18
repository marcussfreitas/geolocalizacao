import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ListComponent } from './map/list/list.component';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    MapComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
