import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

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
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
