import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapRsidebarComponent } from './map-rsidebar.component';

describe('MapRsidebarComponent', () => {
  let component: MapRsidebarComponent;
  let fixture: ComponentFixture<MapRsidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapRsidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapRsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
