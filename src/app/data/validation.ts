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

import { Upload } from "./upload";
import { ValidatorGroups } from "./validator-groups";
import { Workflow } from "./workflow";

export class Validation {
    id: number;
    state: ValidationStatus;
    upload: Upload;
    workflow: Workflow;
    group: number | ValidatorGroups;
    validated_by?: string;
    same_upload_validations?: Validation[];
    final_validation?: ValidationStatus;
    groupStates: GroupStates[]; // use to get all other validations states.
}

export enum ValidationStatus {
    NOT_VALIDATED = 'NOT_VALIDATED',
    VALIDATED_OK = 'VALIDATED_OK',
    VALIDATED_NOK ='VALIDATED_NOK',
}

export class GroupStates {
    description?: string;
    state?: ValidationStatus;
}