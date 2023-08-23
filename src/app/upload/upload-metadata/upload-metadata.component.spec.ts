import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadMetadataComponent } from './upload-metadata.component';

describe('UploadMetadataComponent', () => {
    let component: UploadMetadataComponent;
    let fixture: ComponentFixture<UploadMetadataComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UploadMetadataComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(UploadMetadataComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
