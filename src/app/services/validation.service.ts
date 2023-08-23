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

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Validation, ValidationStatus } from '../data/validation';
import { Page } from '../data/page';

@Injectable({
    providedIn: 'root'
})
export class ValidationService {

    private url = environment.apiURL.concat('upload-validation/');
    // querry parameters for Django FlexFieldsModelSerializer
    private expandParams = "?expand=upload&omit=upload.files&expand=workflow.validator_groups&expand=workflow.pipeline&expand=group&expand=upload.user";

    constructor(private http: HttpClient) { }

    getAll(ordering: string, pageNumber: number, url: string = ""): Observable<Page> {
        if(!url){
            url = `${this.url}${this.expandParams}`
        }
        if(!url.toLowerCase().includes("ordering")){
            url = `${url}&ordering=${ordering}`;
        }

        
        if(!url.toLowerCase().includes("page")){
            url = `${url}&page=${pageNumber}`;
        }
        
        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json'
            })
        };
        return this.http.get<Page>(url, httpOptions);
    }

    get(id: number): Observable<Validation> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json'
            })
        };
        return this.http.get<Validation>(`${this.url}${id}/${this.expandParams}`, httpOptions);
    }

    update(id: number, state: ValidationStatus, username: string): Observable<Validation> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
        };
        return this.http.patch<Validation>(`${this.url}${id}/`, {"state": state, "validated_by": username}, httpOptions);
    }


}
