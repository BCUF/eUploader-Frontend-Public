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
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/data/user';
import { UserService } from 'src/app/services/user.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  
    lang: string;
    user: User;
    token: any;
    errorMessage: string;
    currentUrl: string;

    constructor(public router: Router, public userService: UserService, public authService: AuthService){
        this.router.events.pipe(
            filter((event: any) => event instanceof NavigationEnd)
        ).subscribe(x => this.currentUrl = x.url)
    }
    

    ngOnInit() {
        this.errorMessage = "";
        this.token = localStorage.getItem("token");
        this.lang = localStorage.getItem("lang") || "fr";
        this.getUser();
    }

    setLang(lang: string){
        if(lang != this.lang){
            this.lang = lang;
            localStorage.setItem('lang', lang);
            window.location.reload();
        }
    }

    getUser() {
        this.userService.getUserFromToken(this.token).subscribe({
            next: data => {
                this.user = { ...data };
                if (this.user) {
                    this.userService.saveUserInLocalStorage(this.user);
                }
            },
            error: (error) => {
                this.errorMessage = "unvalid token, please contact the helpdesk";
            }
        });
    }

    logout(){
        this.authService.logout();
    }

}
