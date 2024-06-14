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
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadFilesComponent } from './upload/upload-files/upload-files.component';
import { UploadMetadataComponent } from './upload/upload-metadata/upload-metadata.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule}  from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { A11yModule } from '@angular/cdk/a11y';
import { DialogModule } from '@angular/cdk/dialog';
import { FileDropzoneDirective } from './directives/file-dropzone.directive';
import { ConfirmDialogComponent } from './utils/confirm-dialog/confirm-dialog.component';
import { MetadataFormComponent } from './form/metadata-form/metadata-form.component';
import { FormDialogComponent } from './utils/form-dialog/form-dialog.component';
import { UploadMainComponent } from './upload/upload-main/upload-main.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';

import { HTTP_INTERCEPTORS } from '@angular/common/http';  
import { TokenLangInterceptor } from './auth/token-lang-interceptor';
import { UploadEndComponent } from './upload/upload-end/upload-end.component';
import { LoginComponent } from './auth/login/login.component';
import { ValidationListComponent } from './validation/validation-list/validation-list.component';
import { ValidationUploadComponent } from './validation/validation-upload/validation-upload.component';
import { NoteComponent } from './validation/note/note.component';
import { HeaderComponent } from './common/header/header.component';
import { LOCALE_ID } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MyMatPaginatorIntl } from './utils/my-mat-paginator-intl';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
}

const materialModules = [
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatRadioModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatListModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    DialogModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule, 
    MatGridListModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatMenuModule,
    MatSnackBarModule
];

@NgModule({
    declarations: [
        AppComponent,
        UploadFilesComponent,
        UploadMetadataComponent,
        FileDropzoneDirective,
        ConfirmDialogComponent,
        MetadataFormComponent,
        FormDialogComponent,
        UploadMainComponent,
        UploadEndComponent,
        LoginComponent,
        ValidationListComponent,
        ValidationUploadComponent,
        NoteComponent,
        HeaderComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        A11yModule,
        ReactiveFormsModule,
        FormsModule,
        ...materialModules,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'fr-CH' },
        { provide: MAT_DATE_LOCALE, 
            useValue: 'ch-FR' 
        }, 
        {  
            provide: HTTP_INTERCEPTORS,  
            useClass: TokenLangInterceptor,  
            multi: true  
        },
        {provide: MatPaginatorIntl, useClass: MyMatPaginatorIntl},
    ],
    entryComponents: [ConfirmDialogComponent, FormDialogComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
