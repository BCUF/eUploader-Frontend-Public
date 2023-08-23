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

import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FileService } from 'src/app/services/file.service';
import { Upload } from 'src/app/data/upload';
import { Pipeline } from 'src/app/data/pipeline';
import { UploadedFile, MetadataFileWrapper } from 'src/app/data/uploaded-file';
import { UploadService } from 'src/app/services/upload.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { Utils } from 'src/app/utils/utils';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Dialog } from '@angular/cdk/dialog';
import { FormDialogComponent, FormDialogModel } from 'src/app/utils/form-dialog/form-dialog.component';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/utils/confirm-dialog/confirm-dialog.component';
import { Validation } from 'src/app/data/validation';

@Component({
    selector: 'app-upload-metadata',
    templateUrl: './upload-metadata.component.html',
    styleUrls: ['./upload-metadata.component.scss'],
    animations: [
        trigger('detailExpand', [
          state('collapsed', style({height: '0px', minHeight: '0'})),
          state('expanded', style({height: '*'})),
          transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
      ],
})
export class UploadMetadataComponent implements OnInit {

    @Input() pipeline: Pipeline;
    @Input() uploadId: number;
    @Input() validation: Validation | undefined;

    @Output() metadataStepCompletedEvent = new EventEmitter<any>();

    upload: Upload;
    readOnly: boolean = false;

    formatBytes = Utils.formatBytes;

    filterValue: string;

    allFiles: MetadataFileWrapper[] = []; 

    currentFile: MetadataFileWrapper;

    displayedColumns: string[] = ['name', 'isComplete', 'fill'];
    dataSource = new MatTableDataSource<any>();

    private paginator: MatPaginator;
    private sort: MatSort;
    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.sort = ms;
        this.setDataSourceAttributes();
    }
    
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
        this.setDataSourceAttributes();
    }

    setDataSourceAttributes() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    pageSize = 10;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    pageEvent: PageEvent;

    constructor(private fileService: FileService, private uploadService: UploadService,
        private _liveAnnouncer: LiveAnnouncer, public dialog: Dialog) { }

    ngOnInit(): void {
        this.filterValue = "";
        this.getUpload(this.uploadId);
    }


    setSameMetaForEachFile(event: any){
        console.log(event.checked)
        if (this.upload){
            this.uploadService.setSameMetaForEachFile(this.upload.id, event.checked).subscribe((data: Upload) => {
                this.upload = { ...data };
            })
        }
    }

    edit(file: any){
        this.formDialog(file);
    }

    handleFormFilled(event: any){
        console.log("handleFormFilled: "+event)
        
        if(event.saved){
            if(this.upload.same_meta_for_each_file || (!this.upload.same_meta_for_each_file && this.upload.files.length == 1)){
                for(let file of this.allFiles){
                    file.isComplete = true;
                }
                this.updateFileTable();
                this.confirmDialog();
            }
        }
       
        console.log(`saved: ${event.saved}`);
        if(this.upload.same_meta_for_each_file){
            for(let file of this.allFiles){
                file.isComplete = true;
            }
            this.updateFileTable();
            this.metadataStepCompletedEvent.emit({completedOne: false, completedAll:true});
        }
    }

    formDialog(file: any): void {    
        const dialogData = new FormDialogModel(this.readOnly, this.pipeline, this.upload, file, file.name);
    
        const dialogRef = this.dialog.open(FormDialogComponent, {
            // height: '400px',
            width: '80%',
            data: dialogData,
            // disableClose: true,
            autoFocus: true
        });

    
        dialogRef.closed.subscribe(dialogResult  => {
            let result: any = dialogResult ;
            if(result){
                file.isComplete = true;
                this.updateFileTable();

                if(this.allFiles.every(file => file.isComplete === true)){
                    this.confirmDialog();
                }
                else{
                    if(result.next){
                        let nextFile = this.allFiles.find(f => {
                            return !f.isComplete;
                        });
                        this.formDialog(nextFile);
                    }
                }
            }
        });
    }

    wrapFile(file: UploadedFile): MetadataFileWrapper {
        let mfw = new MetadataFileWrapper()
        if(file.id)
            mfw.id = file.id;
        mfw.upload = file.upload
        mfw.checksum = file.checksum
        if(file.uploaded_file){
            mfw.uploaded_file = file.uploaded_file
            mfw.name = file.name
        }
        if(file.values){
            mfw.values = file.values;
            mfw.isComplete = file.values.length > 0;
        }
           
        return mfw;
    }

    confirmDialog(): void {
        const message = "Cliquer sur terminer pour confirmer l'upload";

        const finishWord = this.validation? "Valider" : "Terminer";
        const refuseWord = this.validation? "NOK" : "";
    
        const dialogData = new ConfirmDialogModel("Confirmation", message, finishWord, "Modifier", refuseWord);
    
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // height: '400px',
            // width: '250',
            data: dialogData,
            disableClose: true,
        });

    
        dialogRef.closed.subscribe(dialogResult  => {
            let result: any = dialogResult;
            if(this.upload){
                if(result.isValidated){
                    this.metadataStepCompletedEvent.emit({wantGoNext: true, isComplete: true});
                }
                else if(result.isNOK){
                    this.metadataStepCompletedEvent.emit({wantGoNext: true, isComplete: false});
                }
                else if(result.isDismissed){
                    this.metadataStepCompletedEvent.emit({wantGoNext: false, isComplete: true});
                }
                else{
                    this.metadataStepCompletedEvent.emit({wantGoNext: false, isComplete: true});
                }
            }
        });
    }

    getUpload(uploadId: number) {

        this.uploadService.getOne(uploadId).subscribe((data: Upload) => {
            this.upload = { ...data };
            for(let file of this.upload.files){
                this.allFiles.push(this.wrapFile(file));
            }
            if(this.allFiles.every(file => file.isComplete === true)){
                this.updateFileTable();
                this.confirmDialog();
            }

            this.updateFileTable();
        })
    }

    applyFilter(event: Event) {
        this.filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter =  this.filterValue.trim().toLowerCase();
    }

    updateFileTable() {
        this.dataSource.data = this.allFiles;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort) {
        // This example uses English messages. If your application supports
        // multiple language, you would internationalize these strings.
        // Furthermore, you can customize the message to add additional
        // details about the values being sorted.
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }


}
