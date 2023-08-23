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
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Validation } from 'src/app/data/validation';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

    title: string;
    message: string;
    btnActionTrueName: string;
    btnActionFalseName: string;
    btnActionNOKName: string;

    constructor(public dialogRef: DialogRef<any>,
        @Inject(DIALOG_DATA) data: ConfirmDialogModel) {
        this.title = data.title;
        this.message = data.message;
        this.btnActionTrueName = data.btnActionTrueName;
        this.btnActionFalseName = data.btnActionFalseName;
        this.btnActionNOKName = data.btnActionNOKName;
    }

    onConfirm(): any {
        this.dialogRef.close({isValidated: true});
    }

    onRefuse(): any {
        this.dialogRef.close({isNOK: true});
    }
    
    onDismiss(): any {
        this.dialogRef.close({isDismissed: true});
    }

}

export class ConfirmDialogModel {

    constructor(public title: string, public message: string, 
        public btnActionTrueName: string, public btnActionFalseName: string, public btnActionNOKName: string) { }

}
