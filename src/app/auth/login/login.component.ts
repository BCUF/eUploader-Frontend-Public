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

import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public loginForm: FormGroup;
    public errorMessage: string;
    @ViewChild("submitBtn") buttonRef: MatButton;

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if(event.key && event.key.toLowerCase() == "enter"){
            if(this.loginForm.valid){
                this.onSubmit()
            }
        }
    }

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.errorMessage = "";
        this.loginForm = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
        });
    }

    public onSubmit() {
        this.authService.login(
            this.loginForm.get('username')!.value,
            this.loginForm.get('password')!.value
        ).subscribe({
            next: token => {
                localStorage.setItem("token", token["token"]);
                this.router.navigate(['validation']);
            },
            error: (error) => {
                if(error.error.non_field_errors){
                    this.errorMessage = error.error.non_field_errors.join(", ");
                }
                else{
                    this.errorMessage = "Unknown error";
                }
            }
        });
    }

}
