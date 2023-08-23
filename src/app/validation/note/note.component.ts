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

import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Note } from 'src/app/data/note';
import { NoteService } from 'src/app/services/note.service';

@Component({
    selector: 'app-note',
    templateUrl: './note.component.html',
    styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {

    @Input() uploadId: number;
    @Input() username: string;

    notes: Note[];
    currentNote: string;
    public createNoteForm: FormGroup;

    constructor(private noteService: NoteService) { }

    ngOnInit(): void {
        this.init();
    }

    toDate(inputDate: any){
        return `${new Date(inputDate).toLocaleDateString()} ${new Date(inputDate).toLocaleTimeString()}`;
    }

    init(){
        this.currentNote = "";
        this.notes = [];
        this.getAllByValidation();
        this.createNoteForm = new FormGroup({
            text: new FormControl('', [Validators.min(1)])
        });
    }

    getAllByValidation(){
        this.noteService.getAllByValidation(this.uploadId).subscribe((data: Note[]) => {
            this.notes = data as Note[];
        });
    }

    public createNote(createFormValue: any){
        if (this.createNoteForm.valid) {
            let note: Note = {
                id: undefined,
                upload: this.uploadId,
                note: createFormValue.text,
                created: undefined,
                user: this.username
            };
            this.noteService.create(note).subscribe(() => {
                this.init();
            })
        }
    }

}
