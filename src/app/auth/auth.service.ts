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

import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient, private router: Router) { }

    public login(username: string, password: string): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json'
            })
        };
        const body = {
            username: username,
            password: password,
        }
        return this.http.post(environment.apiURL + 'api-token-auth/', body, httpOptions);
    }

    public logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("lang");
        localStorage.removeItem("user");
        this.router.navigate(['/login']);
    }
    
    public isLoggedIn(): boolean {
        let token = localStorage.getItem("token");
        return token != null && token.length > 0;
    }
    
    public getToken(): string | null {
        return this.isLoggedIn() ? localStorage.getItem("token") : null;
    }

}
