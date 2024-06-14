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

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Page } from 'src/app/data/page';
import { User } from 'src/app/data/user';
import { Validation, ValidationStatus, GroupStates } from 'src/app/data/validation';
import { Group } from 'src/app/data/group';
import { UserService } from 'src/app/services/user.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
    selector: 'app-validation-list',
    templateUrl: './validation-list.component.html',
    styleUrls: ['./validation-list.component.scss']
})
export class ValidationListComponent implements OnInit {

    user: User | null;
    lang: string;
    token: string | null;
    page: Page;

    validationStatus: any;

    filterValue: string;

    validationList: Validation[];

    @Output() selectedUploadEvent = new EventEmitter<Validation>();
    displayedColumns: string[] = ['id', 'pipeline', 'uploaded_by', 'uploaded_at', 'state', 'group', 'file_count', 'edit'];
    dataSource = new MatTableDataSource<Validation>();

    next: string;
    previous: string;
    total: number;
    defaultPageNumber = 0;
    defaultOrdering = "-upload__uploaded_at";
    ordering: string;
    currentPage: number;
    
    pageSize: number = 15;

    allDataLoaded: boolean;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    pageEvent: PageEvent;

    constructor(private userService: UserService, private authService: AuthService,
        private _liveAnnouncer: LiveAnnouncer, private validationService: ValidationService, private router: Router) { }

    ngOnInit(): void {
        this.allDataLoaded = false;
        this.currentPage = this.defaultPageNumber;
        this.ordering = this.defaultOrdering;
        this.pageEvent = new PageEvent();
        this.currentPage = 1;
        this.validationStatus = ValidationStatus;
        this.lang = localStorage.getItem("lang") || "fr";
        this.setLang(this.lang)
        this.token = localStorage.getItem('token');
        this.getValidations();
    }

    editOrSeeValidation(validation: any) {
        this.router.navigate([`/validation/${validation.id}`]);
    }

    getValidations(url: string = "") {
        this.validationService.getAll(this.ordering, this.currentPage, url).subscribe((data: Page) => {
            this.page = { ...data };
            this.next = this.page.next;
            this.previous = this.page.previous;
            this.total = this.page.count;
            this.validationList = this.page.results as Validation[];
            
            for(let validation of this.validationList){
                let map: Map<number, GroupStates> = new Map<number, GroupStates>();  

                validation.workflow.validator_groups.forEach(function (group){
                    const gs = new GroupStates();
                    gs.name = group.name;
                    gs.description = group.description;
                    map.set(group.id, gs);
                });

                let group = validation.group as Group
                
                let gs = map.get(group.id);
                if(gs){
                    gs.state = validation.state;
                }
                
                validation.same_upload_validations?.forEach(function (other){
                    let gs = map.get(other.group as number);
                    if(gs){
                        gs.state = other.state;
                    }
                });
                
                validation.groupStates = Array.from(map.values());

                // set the final validation status
                if (validation.groupStates.every(elem => elem.state === ValidationStatus.VALIDATED_OK)){
                    validation.final_validation = ValidationStatus.VALIDATED_OK;
                }
                else if (validation.groupStates.some(elem => elem.state === ValidationStatus.VALIDATED_NOK)){
                    validation.final_validation = ValidationStatus.VALIDATED_NOK;
                }
                else{
                    validation.final_validation = ValidationStatus.NOT_VALIDATED;
                }
            }
            this.updateTable();
            this.allDataLoaded = true;
        });
    }

    canValidate(state: ValidationStatus){
        return state === ValidationStatus.NOT_VALIDATED;
    }

    updateTable() {
        this.dataSource.data = this.validationList;
    }

    toDate(inputDate: any){
        return `${new Date(inputDate).toLocaleDateString()} ${new Date(inputDate).toLocaleTimeString()}`;
    }

    setLang(lang: string) {
        this.lang = lang;
        localStorage.setItem('lang', lang);
    }

    getUser() {
        if (this.token) {
            this.userService.getUserFromToken(this.token).subscribe((data: User) => {
                this.user = { ...data };
            });
        }
    }

    public getPage(event: PageEvent): PageEvent {
        this.currentPage = event.pageIndex + 1;
        this.getValidations();
        return event;
    }

    getNextPage(){
        if(this.next){
            this.getValidations(this.next);
        }
    }

    getPreviousPage(){
        if(this.previous){
            this.getValidations(this.previous);
        }
    }

    announceSortChange(sortState: Sort) {
        if(sortState.active == "id"){
            if(sortState.direction == "desc"){
                this.ordering = "-upload__id";
            }
            else{
                this.ordering = "upload__id";
            }
        }
        if(sortState.active == "uploaded_at"){
            if(sortState.direction == "desc"){
                this.ordering = "-upload__uploaded_at";
            }
            else{
                this.ordering = "upload__uploaded_at";
            }
        }
        if(sortState.active == "state"){
            if(sortState.direction == "desc"){
                this.ordering = "-state";
            }
            else{
                this.ordering = "state";
            }
        }
        this.getValidations();
    }

}
