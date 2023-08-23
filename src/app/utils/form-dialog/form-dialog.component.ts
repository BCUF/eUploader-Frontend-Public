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

import { Component, Inject } from '@angular/core';
import { Pipeline } from 'src/app/data/pipeline';
import { Upload } from 'src/app/data/upload';
import { MetadataFileWrapper } from 'src/app/data/uploaded-file';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Validation } from 'src/app/data/validation';

@Component({
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss']
})
export class FormDialogComponent {

    readOnly: boolean;
    pipeline: Pipeline;
    upload: Upload;
    file: MetadataFileWrapper;
    filename?: string;
    validation?: Validation | undefined;
    userScopes: any;

    constructor(public dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA) data: FormDialogModel) {
        this.readOnly = data.readOnly;
        this.pipeline = data.pipeline;
        this.upload = data.upload;
        this.file = data.file;
        if(data.filename){
            this.filename = data.filename;
        }
        else{
            this.filename = "";
        }
        if(data.validation){
            this.validation = data.validation;
        }
        if(data.userScopes){
            this.userScopes = data.userScopes;
        }
    }

    handleFormFilled(event: any){
        if(event.saved){
            this.dialogRef.close(event);
        }
    }

}

export class FormDialogModel {
    constructor(public readOnly: boolean, public pipeline: Pipeline, public upload: Upload, 
        public file: MetadataFileWrapper,  public filename?: string, public validation?: Validation, public userScopes?: any) {}
}
