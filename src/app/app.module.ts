import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { MapViewerComponent } from './components/map-viewer/map-viewer.component';
import { AboutComponent } from './components/about/about.component';
import { MapSidebarComponent } from './components/map-viewer/map-sidebar/map-sidebar.component';
import { MapBottombarComponent } from './components/map-viewer/map-bottombar/map-bottombar.component';
import { LayersManagerComponent } from './components/map-viewer/layers-manager/layers-manager.component';
import { SearchComponent } from './components/map-viewer/search/search/search.component';
import { HttpClientModule } from '@angular/common/http';
import { DataOptionsComponent } from './components/map-viewer/data-options/data-options.component';
import { FormsModule } from '@angular/forms';
import { GraphicsModalComponent } from './components/map-viewer/graphics-modal/graphics-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    MapViewerComponent,
    AboutComponent,
    MapSidebarComponent,
    MapBottombarComponent,
    LayersManagerComponent,
    SearchComponent,
    DataOptionsComponent,
    GraphicsModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
