import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicsModalComponent } from './graphics-modal.component';

describe('GraphicsModalComponent', () => {
  let component: GraphicsModalComponent;
  let fixture: ComponentFixture<GraphicsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphicsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
