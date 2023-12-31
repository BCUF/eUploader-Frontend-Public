import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadMainComponent } from './upload-main.component';

describe('UploadMainComponent', () => {
  let component: UploadMainComponent;
  let fixture: ComponentFixture<UploadMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
