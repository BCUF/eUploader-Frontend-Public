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

import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-upload-end',
    templateUrl: './upload-end.component.html',
    styleUrls: ['./upload-end.component.scss']
})
export class UploadEndComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {}

    reload() {
        window.location.reload();
    }

}
