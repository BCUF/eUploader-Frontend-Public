import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadEndComponent } from './upload-end.component';

describe('UploadEndComponent', () => {
  let component: UploadEndComponent;
  let fixture: ComponentFixture<UploadEndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadEndComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
