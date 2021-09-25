import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LocationsComponent } from './components/locations/locations.component';
import { CrudLocationComponent } from './components/crud-location/crud-location.component';

@NgModule({
  declarations: [
    AppComponent,
    LocationsComponent,
    CrudLocationComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
