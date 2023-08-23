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
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    private url = environment.apiURL.concat('file/');
    private downloadUrl = environment.apiURL.concat('download-file/');

    constructor(private http: HttpClient) { }

    upload(file: File, uploadId: any, checksum: string, type: string): Observable<HttpEvent<any>> {

        const formData: FormData = new FormData();

        formData.append('uploaded_file', file);
        formData.append('upload', uploadId.toString());
        formData.append('checksum', checksum);
        formData.append('type', type);


        const req = new HttpRequest(
            'POST', this.url, formData,
            {
                reportProgress: true,
                responseType: 'json',
            }
        );

        return this.http.request(req);
    }

    delete(file_id: number): Observable<any> {
		return this.http.delete(`${this.url}${file_id}/`);
	}

    getFile(file_id: number): Observable<any> {
		return this.http.get(`${this.downloadUrl}${file_id}/`, {responseType: 'blob' as 'json'});
	}

    updateMetadata(file_id: number, data: any): Observable<any>{
        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }),
        };
        return this.http.put<any>(`${this.url}${file_id}/metadata/`, data, httpOptions);
    }

}
