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

import { MetadataFormsField } from "./metadata-forms-field";
import { Mime } from "./mime";

export class PipelineBase{
    id: number;
    name: string;
    default_same_metadata_for_each_file: boolean;
    can_edit_same_metadata_for_each_file: boolean;
}

export class Pipeline extends PipelineBase{
    description: string;
    max_size_in_byte: number;
    mimes: Mime[];
    fields: MetadataFormsField[];
}
