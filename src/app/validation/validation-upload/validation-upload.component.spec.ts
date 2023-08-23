import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationUploadComponent } from './validation-upload.component';

describe('ValidationUploadComponent', () => {
  let component: ValidationUploadComponent;
  let fixture: ComponentFixture<ValidationUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
