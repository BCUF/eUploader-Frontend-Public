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
import { User } from '../data/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private url = environment.apiURL.concat('user-by-token/');

    constructor(private http: HttpClient) { }

    getUserFromToken(token: string): Observable<User> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json'
            })
        };
        return this.http.get<User>(`${this.url}${token}/`, httpOptions);
    }

    saveUserInLocalStorage(user: User): void {
        localStorage.setItem("user", JSON.stringify(user));
    }

    getUserFromLocalStorage(): User {
        let user = localStorage.getItem("user");
        return user ? JSON.parse(user) : "";
    }

}
