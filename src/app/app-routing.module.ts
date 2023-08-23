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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadMainComponent } from './upload/upload-main/upload-main.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { ValidationUploadComponent } from './validation/validation-upload/validation-upload.component';
import { ValidationListComponent } from './validation/validation-list/validation-list.component';

const routes: Routes = [
    { 
        path: 'upload', component: UploadMainComponent 
    },
    { 
        path: 'validation', 
        component: ValidationListComponent, 
        canActivate: [ AuthGuard ]
    },
    { 
        path: 'validation/:id', 
        component: ValidationUploadComponent, 
        canActivate: [ AuthGuard ]
    },
    {
        path: 'login', 
        component: LoginComponent 
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
