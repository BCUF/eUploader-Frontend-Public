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

import { Component, OnInit, ViewChild } from '@angular/core';
import { FileService } from 'src/app/services/file.service';
import { Upload } from 'src/app/data/upload';
import { User } from 'src/app/data/user';
import { Pipeline } from 'src/app/data/pipeline';
import { UploadedFile, MetadataFileWrapper } from 'src/app/data/uploaded-file';
import { UploadService } from 'src/app/services/upload.service';
import { PipelineService } from 'src/app/services/pipeline.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { Dialog } from '@angular/cdk/dialog';
import { FormDialogComponent, FormDialogModel } from 'src/app/utils/form-dialog/form-dialog.component';
import { ValidationService } from 'src/app/services/validation.service';
import { Validation, ValidationStatus } from 'src/app/data/validation';
import { Metadata } from 'src/app/data/metadata';
import { MetadataFormsField } from 'src/app/data/metadata-forms-field';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-validation-upload',
    templateUrl: './validation-upload.component.html',
    styleUrls: ['./validation-upload.component.scss']
})
export class ValidationUploadComponent implements OnInit {

    validation: Validation;
    user: User;

    errorMessage: string;

    readOnly: boolean;
    
    upload: Upload;
    pipeline: Pipeline;

    uploadIsValid: boolean;

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

    constructor(private _liveAnnouncer: LiveAnnouncer, public dialog: Dialog, private uploadService: UploadService, 
        private fileService: FileService, private pipelineService: PipelineService, 
        private validationService: ValidationService, private route: ActivatedRoute, 
        private router: Router, private userService: UserService, private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.init();
    }

    init(){
        this.allFiles = [];
        this.uploadIsValid = false;
        this.filterValue = "";
        this.route.params.subscribe(paramsId => {
            let id = paramsId["id"];
            this.validationService.get(id).subscribe({
                next: data => {
                    this.validation = data as Validation;
                    this.readOnly = this.validation.state !== ValidationStatus.NOT_VALIDATED;
                    let token = localStorage.getItem("token");
                    if(token){
                        this.userService.getUserFromToken(token).subscribe({
                            next: data => {
                                this.user = data as User;
                                this.getUpload(this.validation.upload.id);
                            },
                            error: (error) => {
                                if(error.error.non_field_errors){
                                    this.errorMessage = error.error.non_field_errors.join(", ");
                                }
                                else{
                                    this.errorMessage = "Unknown error";
                                }
                            }
                        });
                    }
                },
                error: (error) => {
                    if(error.error.non_field_errors){
                        this.errorMessage = error.error.non_field_errors.join(", ");
                    }
                    else{
                        this.errorMessage = "Unknown error";
                    }
                }
            });
        });
    }

    getUpload(uploadId: number) {

        this.uploadService.getOne(uploadId).subscribe((data: Upload) => {
            this.allFiles = []
            this.upload = { ...data };
            this.getPipeline(this.validation.workflow.pipeline.id)
        })
    }

    getPipeline(pipelineId: number) {
        this.pipelineService.getOne(pipelineId).subscribe((data: Pipeline) => {
            this.pipeline = { ...data };
            for(let file of this.upload.files){
                this.allFiles.push(this.wrapFile(file));
            }
            if(this.allFiles.every(file => file.isComplete === true)){
                this.uploadIsValid = true;
            }
            this.updateFileTable();
        });
    }

    updateValidation(id:number, state: ValidationStatus, validated_by: string){
        this.validationService.update(id, state, validated_by).subscribe({
            next: data => {
                if(data.state == state){
                    this.router.navigate(['validation']);
                }
            },
            error: (error) => {
                if(error.error.non_field_errors){
                    this.errorMessage = error.error.non_field_errors.join(", ");
                }
                else{
                    this.errorMessage = "Unknown error";
                }
            }
        });
    }

    openFile(id: number, filename: string) {
        this.fileService.getFile(id).subscribe(
            (response: any) =>{
                let dataType = response.type;
                let binaryData = [];
                binaryData.push(response);

                let downloadLink = document.createElement('a');
                downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
                if (filename)
                    downloadLink.setAttribute('download', filename);
                document.body.appendChild(downloadLink);
                downloadLink.click();
            })
    }

    cancel(){
        this.router.navigate([`/validation/`]);
    }

    validate(isOk: boolean){
        if(isOk){
            if(this.uploadIsValid){
                this.updateValidation(this.validation.id, ValidationStatus.VALIDATED_OK, this.user.username)
            }
        }
        else{
            this.updateValidation(this.validation.id, ValidationStatus.VALIDATED_NOK, this.user.username)
        }
    }

    setSameMetaForEachFile(event: any){
        if (this.upload){
            this.uploadService.setSameMetaForEachFile(this.upload.id, event.checked).subscribe({
                next: data => {
                    this.init();
                },
                error: (error) => {
                    if(error.error.non_field_errors){
                        this.errorMessage = error.error.non_field_errors.join(", ");
                    }
                    else{
                        this.errorMessage = "Unknown error";
                    }
                }
            });
        }
    }

    edit(file: any){
        this.formDialog(file);
    }

    handleFormFilled(event: any){
        if(event.saved){
            if(this.upload.same_meta_for_each_file || (!this.upload.same_meta_for_each_file && this.upload.files.length == 1)){
                for(let file of this.allFiles){
                    file.isComplete = true;
                }
                this.updateFileTable();
                this.uploadIsValid = true;

                this.snackBar.open('Formulaire sauvegardé', 'close', {
                    duration: 10000,
                });
            }
        }
    }

    formDialog(file: any): void {
    
        const dialogData = new FormDialogModel(this.readOnly, this.pipeline, this.upload, file, file.name, this.validation, this.user.groups);
    
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
                console.log(result)
                file.isComplete = true;
                this.updateFileTable();

                if(this.allFiles.every(file => file.isComplete === true)){
                    this.uploadIsValid = true;
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
            mfw.isComplete =  this.metadataAreValide(file.values)
        }
        return mfw;
    }

    canEdit(field: MetadataFormsField){
        if(this.validation && this.user.groups && this.user.groups.length > 0){
            return this.user.groups.includes(field.scope);
        }
        return false;
    }

    /**
     * For now simply check if a required field is as been already filled. This is not safe
     */
    metadataAreValide(values: Metadata[]): boolean{
        for (let field of this.pipeline.fields){
            if(field.type === "TEXT" || field.type === "NUMBER" || field.type === "TEXT_AREA"|| field.type === "TIME"|| field.type === "DATE" || field.type === "DURATION"){
                if(field.required && this.canEdit(field)){
                    if (values.some(e => e.key == field.key)) {
                        for(let metadata of values){
                            if(field.key == metadata.key){
                                if(metadata.value.length <= 0){
                                    return false;
                                }
                            }
                        }
                    }
                    else{
                        return false;
                    }
                }
            }
           
            else if(field.type === "CHECKBOX"){
                if(field.required && this.canEdit(field)){
                    if (values.some(e => e.key == field.key)) {
                        let selected = []
                        for(let metadata of values){
                            if(field.key == metadata.key){
                                let values = metadata.value.split("||")
                                selected.push(...values)
                                break;
                            }
                        }
                        if(selected.length <= 0){
                            return false;
                        }
                    }
                    else{
                        return false;
                    }
                    
                }
            }

            else if(field.type === "SELECT"){
                if(field.required && this.canEdit(field)){
                    if (values.some(e => e.key == field.key)) {
                        let selected = "";
                        for(let metadata of values){
                            if(field.key == metadata.key){
                                selected = metadata.value
                                break;
                            }
                        }
                        if(!selected){
                            return false;
                        }
                    }
                    else{
                        return false;
                    }
                }
            }
        }
        return true;
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

    announceSortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

}
