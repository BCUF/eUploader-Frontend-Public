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

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Pipeline } from 'src/app/data/pipeline';
import { Upload } from 'src/app/data/upload';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MetadataFileWrapper } from 'src/app/data/uploaded-file';
import { Metadata } from 'src/app/data/metadata';
import { FileService } from 'src/app/services/file.service';
import { Validation } from 'src/app/data/validation';
import { MetadataFormsField } from 'src/app/data/metadata-forms-field';

@Component({
    selector: 'app-metadata-form',
    templateUrl: './metadata-form.component.html',
    styleUrls: ['./metadata-form.component.scss']
})
export class MetadataFormComponent implements OnInit {

    @Input() readOnly: boolean;
    @Input() pipeline: Pipeline;
    @Input() upload: Upload;
    @Input() file: MetadataFileWrapper;
    @Input() isNextButton: boolean;
    @Input() validation: Validation | undefined;
    @Input() userScopes: number[] | undefined;

    @Output() hasBeenFilledEvent = new EventEmitter<any>();

    public metadataForm: FormGroup;

    constructor(private fileService: FileService) { }

    ngOnInit(): void {
        this.createForm();
    }

    canEdit(field: MetadataFormsField){
        if (field.scope){
            if(this.validation && this.userScopes && this.userScopes.length > 0){
                return this.userScopes.includes(field.scope);
            }
        }
        else{
            return true;
        }
        return false;
    }

    createForm(){
        let group: any = {};    
        for (let field of this.pipeline.fields){
            let validators: any = []
            if(field.type === "TEXT"){
                if(field.required && this.canEdit(field)){
                    validators.push(Validators.required)
                }
                let defaultValue = field.default_value ? field.default_value : '';

                for(let metadata of this.file.values as Metadata[]){
                    if(field.key == metadata.key){
                        defaultValue = metadata.value;
                        break;
                    }
                }
                group[field.key] = new FormControl({value: defaultValue, disabled: !this.canEdit(field)}, validators);
            }
            else if(field.type === "NUMBER"){
                let validators: any = []
                if(field.required && this.canEdit(field)){
                    validators.push(Validators.required)
                }
                let defaultValue = isNaN(field.default_value) ? '' : (field.default_value ? field.default_value : '');
                for(let metadata of this.file.values as Metadata[]){
                    if(field.key == metadata.key){
                        defaultValue = metadata.value;
                        break;
                    }
                }
                group[field.key] = new FormControl({value: defaultValue, disabled: !this.canEdit(field)}, validators);  
            }
            else if(field.type === "TEXT_AREA"){
                let validators: any = []
                if(field.required && this.canEdit(field)){
                    validators.push(Validators.required)
                }
                let defaultValue = field.default_value ? field.default_value : '';
                for(let metadata of this.file.values as Metadata[]){
                    if(field.key == metadata.key){
                        defaultValue = metadata.value;
                        break;
                    }
                }
                group[field.key] = new FormControl({value: defaultValue, disabled: !this.canEdit(field)}, validators);  
            }
            else if(field.type === "TIME"){
                let validators: any = []
                if(field.required && this.canEdit(field)){
                    validators.push(Validators.required)
                }
                let regexp = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])(:([0-5]?[0-9]))*$/;
                let defaultValue = regexp.test(field.default_value) ? (field.default_value ? field.default_value : '') : '';
                for(let metadata of this.file.values as Metadata[]){
                    if(field.key == metadata.key){
                        defaultValue = metadata.value;
                        break;
                    }
                }
                group[field.key] = new FormControl({value: defaultValue, disabled: !this.canEdit(field)}, validators);  
            }
            else if(field.type === "DURATION"){
                let validators: any = []
                if(field.required && this.canEdit(field)){
                    validators.push(Validators.required)
                }
                const regexp: RegExp = /^\d+:([0-5]?[0-9])(:([0-5]?[0-9]))*$/;
                let defaultValue = regexp.test(field.default_value) ? (field.default_value ? field.default_value : '') : '';
                for(let metadata of this.file.values as Metadata[]){
                    if(field.key == metadata.key){
                        defaultValue = metadata.value;
                        break;
                    }
                }
                group[field.key] = new FormControl({value: defaultValue, disabled: !this.canEdit(field)}, validators);  
            }
            else if(field.type === "DATE"){
                if(field.required && this.canEdit(field)){
                    validators.push(Validators.required)
                }
                let date = (isNaN(field.default_value) && !isNaN(Date.parse(field.default_value))) ? (field.default_value ? new Date(field.default_value) : '') : '';
                for(let metadata of this.file.values as Metadata[]){
                    if(field.key == metadata.key){
                        let dateValues = metadata.value.split(" ")[0].split("-");
                        let year = parseInt(dateValues[0]);
                        let month = parseInt(dateValues[1]) - 1;
                        let day = parseInt(dateValues[2]);
                        date = new Date(year, month, day)
                        break;
                    }
                }
                group[field.key] = new FormControl({value: date, disabled: !this.canEdit(field)}, validators);  
            }

            else if(field.type === "CHECKBOX"){
                if(field.required && this.canEdit(field)){
                    validators.push(Validators.required)
                }
                let selected = []
                for(let metadata of this.file.values as Metadata[]){
                    if(field.key == metadata.key){
                        let values = metadata.value.split("||")
                        selected.push(...values)
                        break;
                    }
                }
                if(selected.length <= 0){
                    for (let option of field.options){
                        if(option.dflt)
                            selected.push(option.value)
                    }
                }
                group[field.key] = new FormControl({value: selected, disabled: !this.canEdit(field)}, validators);
            }

            else if(field.type === "SELECT"){
                if(field.required && this.canEdit(field)){
                    validators.push(Validators.required)
                }
                let selected = "";
                for(let metadata of this.file.values as Metadata[]){
                    if(field.key == metadata.key){
                        selected = metadata.value
                        break;
                    }
                }
                if(!selected){
                    for (let option of field.options){
                        if(option.dflt)
                            selected = option.value
                    }
                }
                group[field.key] = new FormControl({value: selected, disabled: !this.canEdit(field)}, validators);
            }
        }
        this.metadataForm = new FormGroup(group);

        if(this.readOnly){
            for (var control in this.metadataForm.controls) {
                this.metadataForm.controls[control].disable();
            }
        }
    }

    hasError(controlName: string, errorName: string){
        return this.metadataForm.controls[controlName].hasError(errorName);
    }

    saveMetadata(metadataFormValue: any, next: boolean){
        if (this.metadataForm.valid) {
            this.executeMetadataCreation(metadataFormValue, next);
        }
    }

    executeMetadataCreation(metadataFormValue: any, next: boolean){
        let id = this.file.id as number;
        Object.entries(metadataFormValue).forEach(([key, value]) => {
            if(value){
                let metadata = new Metadata();
                metadata.file = id;
                metadata.key = key;

                if(typeof value === "string"){
                    metadata.value = value;
                }
                else{
                    if(value instanceof Date){
                        const offset = value.getTimezoneOffset()
                        let date = new Date(value.getTime() - (offset*60*1000))
                        metadata.value = date.toISOString().split('T')[0]
                    }
                    else if (typeof value === "number"){
                        metadata.value = value.toString()
                    }
                    else if(Array.isArray(value)){
                        metadata.value = value.join('||')
                    }
                }
                if(this.file.values)
                    this.file.values.push(metadata)
            }
        })

        this.fileService.updateMetadata(id, this.file.values).subscribe((data: any) => {
            let updatedFile = { ...data };
            if(updatedFile.values != this.file.values){
                this.file.values = [...updatedFile.values];
            }
            if(next){
                this.hasBeenFilledEvent.emit({saved: true, next: true});
            }
            else{
                this.hasBeenFilledEvent.emit({saved: true, next: false});
            }
        })
    }

}
