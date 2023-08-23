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

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Upload, Status } from '../data/upload';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UploadService {

    private url = environment.apiURL.concat('upload/');

    constructor(private http: HttpClient) { }

    getOne(id: number): Observable<Upload> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json'
            })
        };
        return this.http.get<Upload>(`${this.url}${id}/`, httpOptions);
    }

    create(upload: object): Observable<Upload> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
        };
        return this.http.post<Upload>(this.url, upload, httpOptions);
    }

    setStatus(id: number, status: Status): Observable<Upload> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
        };
        return this.http.patch<Upload>(`${this.url}${id}/`, {"status": status}, httpOptions);
    }

    getLastUpload(): Observable<Upload> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json'
            }),
        };
        return this.http.get<Upload>(`${this.url}last-upload/`, httpOptions);
    }

    setSameMetaForEachFile(id: number, same_meta_for_each_file: boolean): Observable<Upload> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
        };
        return this.http.patch<Upload>(`${this.url}${id}/`, {"same_meta_for_each_file": same_meta_for_each_file}, httpOptions);
    }

}
