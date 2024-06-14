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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    currentLang: string;
    user: User;
    token: any;
    errorMessage: string;
    currentUrl: string;

    constructor(public router: Router, public userService: UserService, public authService: AuthService, public translate: TranslateService){
        this.router.events.pipe(
            filter((event: any) => event instanceof NavigationEnd)
        ).subscribe(x => this.currentUrl = x.url)
    }

    ngOnInit() {
        this.errorMessage = "";
        this.token = localStorage.getItem("token");
        this.currentLang = localStorage.getItem("lang") || "fr";
        this.translate.use(this.currentLang)
        this.getUser();
    }

    setLang(lang: string){
        if(lang != this.currentLang){
            this.currentLang = lang;
            localStorage.setItem('lang', lang);
            this.translate.use(lang);
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
                this.errorMessage = this.translate.instant('ERROR.INVALID_TOKEN');
            }
        });
    }

    logout(){
        this.authService.logout();
    }

}
