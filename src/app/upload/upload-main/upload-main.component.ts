/*
* Copyright (c) BCU Fribourg
*
* This file is part of eUploader-Frontend.
* eUploader-Frontend is free software: you can redistribute it and/or modify 
* it under the terms of the GNU General Public License as published by the 
* Free Software Foundation, either version 3 of the License, or (at your option) any later version.
* eUploader-Frontend is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
* without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
* See the GNU General Public License for more details.
* You should have received a copy of the GNU General Public License along with eUploader-Frontend. 
* If not, see <https://www.gnu.org/licenses/>.
*/

import { Component, OnInit, Input, Inject, AfterViewInit, ViewChild, Output, EventEmitter, NgZone, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileService } from 'src/app/services/file.service';
import { Upload, Status } from 'src/app/data/upload';
import { User } from 'src/app/data/user';
import { Pipeline } from 'src/app/data/pipeline';
import { UploadedFile, FileWrapper } from 'src/app/data/uploaded-file';
import { UploadService } from 'src/app/services/upload.service';
import { UserService } from 'src/app/services/user.service';
import { PipelineService } from 'src/app/services/pipeline.service';
import { ActivatedRoute, Router, ParamMap, Params } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { Utils } from 'src/app/utils/utils';
import { Dialog, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/utils/confirm-dialog/confirm-dialog.component';
import { MatStepper } from '@angular/material/stepper';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-upload-main',
    templateUrl: './upload-main.component.html',
    styleUrls: ['./upload-main.component.scss']
})
export class UploadMainComponent implements OnInit {

    errorMessage: string;

    isEditable: boolean;
    filesUploaded: boolean;
    metadataUploaded: boolean;
    finish: boolean;

    pipeline: Pipeline;
    upload: Upload;
    token: string;
    user: User;

    lang: string;

    endStatus: Status = Status.COMPLETED;

    dataLoaded: boolean;

    @ViewChild('stepper') stepper: MatStepper;

    constructor(private fileService: FileService, private uploadService: UploadService,
        private route: ActivatedRoute, private userService: UserService, private pipelineService: PipelineService, 
        private _liveAnnouncer: LiveAnnouncer, private router: Router, public dialog: Dialog, 
        private ngZone: NgZone, private changeDetector: ChangeDetectorRef, public translate: TranslateService) { }

    ngOnInit() {
        this.errorMessage = "";

        this.dataLoaded = false;

        this.isEditable = false;
        this.filesUploaded = false;
        this.metadataUploaded = false;

        this.route.queryParams.subscribe(params => {
            this.token = params['token'];
            if (this.token !== "" && this.token.length > 0) {
                localStorage.setItem('token',  this.token);
                this.getUser();
            }
        });

        this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            if(this.user?.pipeline){
                this.getPipeline(this.user?.pipeline)
            }
        });

    }

    ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }

    getUser() {
        this.userService.getUserFromToken(this.token).subscribe({
            next: data => {
                this.user = { ...data };
                if (this.user) {
                    this.getOrCreateUpload();
                }
            },
            error: (error) => {
                this.errorMessage = this.translate.instant('ERROR.INVALID_TOKEN');
            }
        });
    }

    getPipeline(pipeline_id: number) {
        this.pipelineService.getOne(pipeline_id).subscribe((data: Pipeline) => {
            this.pipeline = { ...data };
            this.dataLoaded = true;
        });
    }

    getOrCreateUpload() {
        let upload = {};
        this.uploadService.create(upload).subscribe((data: Upload) => {
            this.upload = { ...data };
            console.log(this.upload)
            console.log(this.upload.status)

            if(this.user?.pipeline){
                this.getPipeline(this.user?.pipeline)
            }
            else{
                this.dataLoaded = true;                
            }            
        })
    }

    handleFileUploadStepComplete(event: any){
        console.log(event)
        this.filesUploaded = event.isComplete;

        if(event.noMoreFiles) { 
            console.log("noMoreFiles CASE")
            this.initUpload();
        } 
        else if(event.wantGoNext) { 
            console.log("WANT GO NEXT CASE")
            this.filesUploaded = true;
            this.setFileUploadedStatusAndGoNext();
        } 
    }

    handleMetadataStepComplete(event: any){
        console.log("EVENT")
        console.log(event)
        this.metadataUploaded = event.isComplete;
        if(event.isAborted){
            this.metadataUploaded = true;
            this.setUploadAbortedAndGoNext();
        }
        if(event.wantGoNext){
            this.metadataUploaded = true;
            this.finishStep();
        }
        else{
            this.metadataUploaded = event.isComplete;
        }
    }


    goToNextStep(){
        this.ngZone.run(() => {
            if(this.stepper.selected){
                this.stepper.selected.completed = true;
                if(this.pipeline){
                    this.stepper.selected.editable = true;
                }
                else{
                    this.stepper.selected.editable = false;
                }
                
            }
            this.stepper.next();
        });   
    }

    initUpload(){
        this.uploadService.setStatus(this.upload.id, Status.INIT).subscribe((data: Upload) => {
            this.upload = { ...data };
        })
    }

    setFileUploadedStatusAndGoNext(){
        let status: Status;
        if(this.pipeline){
            status = Status.FILE_UPLOADED;
        }
        else{
            status = Status.COMPLETED;
        }
        this.uploadService.setStatus(this.upload.id, status).subscribe((data: Upload) => {
            this.upload = { ...data };
            if(this.upload.status === Status.FILE_UPLOADED || this.upload.status === Status.COMPLETED){
                this.goToNextStep();
            }
        })
    }

    finishStep(){
        this.uploadService.setStatus(this.upload.id, Status.COMPLETED).subscribe((data: Upload) => {
            this.upload = { ...data };
            if(this.upload.status === Status.COMPLETED){
                this.ngZone.run(() => {
                    if(this.stepper.selected){
                        this.stepper.selected.completed = true;
                        this.stepper.selected.editable = false;
                    }
                    this.stepper.next();
                });   
            }
        })
    }

    // setMetadataUploadedStatusAndGoNext(){
    //     this.uploadService.setStatus(this.upload.id, Status.COMPLETED).subscribe((data: Upload) => {
    //         this.upload = { ...data };
    //         if(this.upload.status === Status.COMPLETED){
    //             this.goToNextStep();
    //         }
    //     })
    // }  

    setUploadAbortedAndGoNext(){
        this.uploadService.setStatus(this.upload.id, Status.ABORTED).subscribe((data: Upload) => {
            this.upload = { ...data };
            if(this.upload.status === Status.ABORTED){
                this.goToNextStep();
            }
        })
    }  

}
