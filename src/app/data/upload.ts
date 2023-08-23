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

import { UploadedFile } from "./uploaded-file";
import { User } from "./user";

export class Upload {
    id: number;
    uploaded_at: Date;
    same_meta_for_each_file: boolean;
    status: Status;
    file_count?: number;
    files: UploadedFile[];
    user?: User | number;
}

export enum Status {
    INIT = 'INIT',
    FILE_UPLOADED = 'FILE_UPLOADED',
    COMPLETED ='COMPLETED',
    ERROR = 'ERROR',
    ABORTED = 'ABORTED'
}