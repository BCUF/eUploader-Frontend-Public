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
import {Injectable} from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FileService } from 'src/app/services/file.service';
import { Upload, Status } from 'src/app/data/upload';
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
import { FileToSha256, Utils } from 'src/app/utils/utils';
import { Dialog, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/utils/confirm-dialog/confirm-dialog.component';
import { LoadingDialogComponent, DialogSpinnerComponent } from 'src/app/utils/loading-dialog/loading-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import CryptoES from 'crypto-es';


@Component({
    selector: 'app-upload-files',
    templateUrl: './upload-files.component.html',
    styleUrls: ['./upload-files.component.scss']
})
export class UploadFilesComponent implements OnInit {

    formatBytes = Utils.formatBytes;

    filterValue: string;

    allFiles: FileWrapper[] = [];

    displayedColumns: string[] = ['name', 'size', 'type', 'progression', 'delete'];
    dataSource = new MatTableDataSource<FileWrapper>();

    selectedFileNames: string[] = [];

    @Input() pipeline: Pipeline;
    @Input() upload: Upload;

    @Output() fileUploadStepCompletedEvent = new EventEmitter<any>();

    error: string;

    isReady: boolean;

    allowed_mimes: string[];

    uploading: boolean;

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
        private route: ActivatedRoute, private userService: UserService, private pipelineService: PipelineService, 
        private _liveAnnouncer: LiveAnnouncer, private router: Router, public dialog: Dialog, private matDialog: MatDialog) { }

    ngOnInit(): void {

        this.uploading = false;

        if(this.pipeline){
            this.allowed_mimes = this.pipeline.mimes.map(m => m.mime);
        }
        else{
            this.allowed_mimes = []
        }

        if(this.upload.files){
            for(let file of this.upload.files){
                this.wrapAlreadyUploadedFiles(file);
            }
        }
        this.updateFileTable();

        switch(this.upload.status) { 
            case Status.FILE_UPLOADED: { 
                this.fileUploadStepCompletedEvent.emit({wantGoNext: this.upload.files.length > 0, isComplete: this.upload.files.length > 0});
                break; 
            } 
            case Status.INIT: { 
                this.fileUploadStepCompletedEvent.emit({wantGoNext: false, isComplete: this.upload.files.length > 0});
                break; 
            } 
            default: { 
                break; 
            } 
        }
    }

    updateFileTable() {
        this.dataSource.data = this.allFiles;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    setPageSizeOptions(setPageSizeOptionsInput: string) {
        if (setPageSizeOptionsInput) {
            this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
        }
    }

    deleteFile(file: any) {
        if (file.progression == 100) {
            this.fileService.delete(file.id).subscribe(() => {
                this.allFiles = this.allFiles.filter(function (f) {
                    return f.name !== file.name;
                });
                this.updateFileTable();
                if(this.allFiles.length == 0){
                    this.fileUploadStepCompletedEvent.emit({wantGoNext: false, isComplete: false, noMoreFiles: true});
                }
            });
        }
        else {
            this.allFiles = this.allFiles.filter(function (f) {
                return f.name !== file.name;
            });
            this.updateFileTable();
            if(this.allFiles.length == 0){
                this.fileUploadStepCompletedEvent.emit({wantGoNext: false, isComplete: false});
            }
        }
    }

    browseFiles() {
        document.getElementById('input-file')?.click();
    }

    handleFilesFromInput(e: any) {

        const files = e.currentTarget.files;
        for (let i = 0; i < files.length; i++) {
            if (this.isValid(files[i])) {
                this.wrapFile(files[i]);
                // disable NEXT button if files added after can go next event
                this.fileUploadStepCompletedEvent.emit({wantGoNext: false, isComplete: false});
            }
        }
        if(this.allFiles.length > 0){
            this.uploadFiles();
        }
        
    }

    droppedFiles(files: File[]): void {
        for (let i = 0; i < files.length; i++) {
            if (this.isValid(files[i])) {
                this.wrapFile(files[i]);
                // disable NEXT button if files added after can go next event
                this.fileUploadStepCompletedEvent.emit({wantGoNext: false, isComplete: false});
            }
        }
        if(this.allFiles.length > 0){
            this.uploadFiles();
        }
    }

    wrapAlreadyUploadedFiles(file: UploadedFile){
        let fw = new FileWrapper();
        fw.id = file.id;
        if (this.upload) {
            fw.upload = this.upload.id;
        }
        fw.size = file.size
        fw.display_size = Utils.formatBytes(file.size, 2);
        fw.name = file.name;
        fw.type = file.type;
        fw.file = undefined;
        fw.progression = 100;
        this.allFiles.push(fw);
    }

    wrapFile(file: File) {

        let fw = new FileWrapper()
        if (this.upload) {
            fw.upload = this.upload.id;
        }
        fw.size = file.size
        fw.display_size = Utils.formatBytes(file.size, 2);
        fw.name = file.name;
        fw.type = file.type;
        fw.file = file;
        // fw.uploaded = false;
        fw.progression = 0;
        this.allFiles.push(fw);
        this.updateFileTable();
    }

    async computeChecksum(file: FileWrapper): Promise<string> {
        const f = new FileToSha256()
        if (file.file) {
            return await f.sha256(file.file)
        }
        return Promise.reject("file not available");
    }

    async uploadFiles() {
        if (this.allFiles) {
            this.uploading = true;
            for (let file of this.allFiles) {
                if(file.progression < 100){
                    try {
                        file.progression = 1;
                        let hash = await this.computeChecksum(file);
                        file.checksum = hash;
                        this.uploadAFile(file);
                    }
                    catch (error) {
                        console.error(error);
                    }
                }
            }
        }
    }

    goToLink(url: string) {
        window.open(url, "_blank");
    }

    uploadAFile(file: FileWrapper): void {

        if (file && (file.progression < 100)) {
            
            this.fileService.upload(file.file as File, this.upload?.id, file.checksum, file?.type as string).subscribe(
                (event: any) => {
                    if (event.type === HttpEventType.UploadProgress) {
                        // Progression upload is max 99% insteand of 100% because
                        // it can be a big difference of time betwin the upload is 100 and the backend save time return response
                        file.progression = Math.round(99 * event.loaded / event.total);
                    } 
                    else if (event instanceof HttpResponse) {

                        let uploaded_file: UploadedFile = { ...event.body };
                        file.id = uploaded_file.id;
                        file.uploaded_file = uploaded_file.uploaded_file
                        file.progression = 100;
                        // file.size = uploaded_file.size
                        this.updateFileTable();
                        // if all files are uploaded
                        if(this.allFiles.every(file => file.progression === 100)){
                            this.uploading = false;
                            this.confirmDialog();
                        }

                    }
                },
                (err: any) => {
                    // this.progressInfos[idx].value = 0;
                    file.progression = 0;
                    const msg = `Could not upload the file: ${file.name}`;
                    this.errorDialog(msg)
                });
        }
    }

    // goToMetadataView(){
    //     this.router.navigate([`metadata`, this.upload?.id], {queryParams: { token: this.token }});
    // }


    isValid(file: File) {
        let file_not_exists: boolean = false;
        let size_is_valid: boolean = false;
        let type_is_valid: boolean = false;
        
        // check if file is already in the list
        if (this.allFiles.find(f => f.name == file.name)) {
            let message = `Le nom du fichier ${file.name} se trouve déjà dans la liste`;
            this.errorDialog(message);
            file_not_exists = false;
        }
        else {            
            file_not_exists = true;
        }
        if (this.pipeline) {
            if (file.size <= this.pipeline.max_size_in_byte) {
                size_is_valid = true;
            }
            else {
                let message = `La taille du fichier ${file.name} dépasse la taille maximale de ${Utils.formatBytes(this.pipeline.max_size_in_byte)}`
                this.errorDialog(message);
            }
            if (this.allowed_mimes.includes(file.type)) {
                type_is_valid = true;
            }
            else {
                let message = `Le type du fichier ${file.name} n'est pas dans ${this.allowed_mimes.toString().split(',').join(', ')}`
                this.errorDialog(message);
            }
        }
        else{
            size_is_valid = true;
            type_is_valid = true;
        }
        return size_is_valid && type_is_valid && file_not_exists;
    }

    

    applyFilter(event: Event) {
        this.filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = this.filterValue.trim().toLowerCase();
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

    confirmDialog(): void {
        const message = "Passez à l'étape suivante?";
    
        const dialogData = new ConfirmDialogModel("Confirmation", message, "Suivant", "Continuer d'ajouter des fichiers", "");
    
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            disableClose: true,
            height: '400px',
            width: '250',
            data: dialogData
        });

    
        dialogRef.closed.subscribe(dialogResult  => {
            let result:any = dialogResult;
            console.log("RESULT")
            if(this.upload){
                if(result.isValidated){
                    this.fileUploadStepCompletedEvent.emit({wantGoNext: true, isComplete: true});
                }
                else{
                    this.fileUploadStepCompletedEvent.emit({wantGoNext: false, isComplete: true});
                }
            }
        });
    }

    deleteDialog(file: FileWrapper): void {
        const message = `Voulez-vous effacer le fichier ${file.name}?`;
    
        const dialogData = new ConfirmDialogModel("Confirmation", message, "Effacer", "Annuler", "");
    
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            height: '400px',
            width: '250',
            data: dialogData
        });

    
        dialogRef.closed.subscribe(dialogResult  => {
            let result:any = dialogResult ;
            if(result.isValidated){
                this.deleteFile(file);
            }
        });
    }

    errorDialog(message: string): void {
    
        const dialogData = new ConfirmDialogModel("Erreur", message, "OK", "", "");
    
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            height: '400px',
            width: '250',
            data: dialogData
        });

    
    }

}