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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-loading-dialog',
    templateUrl: './loading-dialog.component.html',
    styleUrls: ['./loading-dialog.component.scss']
})
export class LoadingDialogComponent { }

@Component({
    selector: 'app-dialog-spinner',
    template: ``,
    styles: []
})
export class DialogSpinnerComponent implements OnInit, OnDestroy {

    constructor(private matDialog: MatDialog) { }

    dialogRef: any;

    ngOnInit() {
        this.dialogRef = this.matDialog.open(LoadingDialogComponent, { disableClose: true });
    }
    ngOnDestroy() {
        setTimeout(() => {
            this.dialogRef.close();
        });
    }
}