import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapBottombarComponent } from './map-bottombar.component';

describe('MapBottombarComponent', () => {
  let component: MapBottombarComponent;
  let fixture: ComponentFixture<MapBottombarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapBottombarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapBottombarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
