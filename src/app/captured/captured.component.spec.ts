import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapturedComponent } from './captured.component';

describe('CapturedComponent', () => {
  let component: CapturedComponent;
  let fixture: ComponentFixture<CapturedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapturedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapturedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
