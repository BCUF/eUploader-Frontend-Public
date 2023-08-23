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

import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[appFileDropzone]'
})
export class FileDropzoneDirective {

    @Output() onFileDropped = new EventEmitter<any>();

    @HostBinding('style.opacity') private opacity = '1';
    @HostBinding('style.border') private border = 'none';

    constructor() { }

    @HostListener('dragover', ['$event']) public onDragOver(evt: any): any {
        evt.preventDefault();
        evt.stopPropagation();
        this.opacity = '0.8';
        this.border = 'dotted 2px #000000';
    }

    @HostListener('dragleave', ['$event']) public onDragLeave(evt: any): any {
        evt.preventDefault();
        evt.stopPropagation();
        this.opacity = '1';
        this.border = 'none';
    }

    @HostListener('drop', ['$event']) public ondrop(evt: any): any {
        evt.preventDefault();
        evt.stopPropagation();
        this.opacity = '1';
        this.border = 'none';
        const files = evt.dataTransfer.files;
        if (files.length > 0) {
            this.onFileDropped.emit(files);
        }
    }

}
