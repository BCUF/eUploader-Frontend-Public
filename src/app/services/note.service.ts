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
import { environment } from 'src/environments/environment';
import { Note } from '../data/note';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NoteService {

    private url = environment.apiURL.concat('note/');

    constructor(private http: HttpClient) { }

    create(note: Note): Observable<Note> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json'
            }),
        };
        return this.http.post<Note>(`${this.url}`,note, httpOptions);
    }


    getAllByValidation(uploadId: number): Observable<Note[]> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json'
            })
        };
        return this.http.get<Note[]>(`${this.url}?upload=${uploadId}`, httpOptions);
    }


}
