import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MapViewerComponent } from './components/map-viewer/map-viewer.component';
import { AboutComponent } from './components/about/about.component';

const routes: Routes = [
  { path: '', component: MapViewerComponent },
  { path: 'home', component: HomeComponent },
  { path: 'viewer', component: MapViewerComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
