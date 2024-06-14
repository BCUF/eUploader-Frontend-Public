import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class MyMatPaginatorIntl implements MatPaginatorIntl{

    constructor(private readonly translate: TranslateService) {
        this.translate.onLangChange.subscribe(event => {
            this.translate.use(event.lang);
            this.itemsPerPageLabel = this.translate.instant('PAGINATOR.ITEMS_PER_PAGE_LABEL');
            this.nextPageLabel = this.translate.instant('PAGINATOR.NEXT_PAGE_LABEL');
            this.previousPageLabel = this.translate.instant('PAGINATOR.PREVIOUS_PAGE_LABEL');
            this.firstPageLabel = this.translate.instant('PAGINATOR.FIRST_PAGE_LABEL');
            this.lastPageLabel = this.translate.instant('PAGINATOR.LAST_PAGE_LABEL');
            this.changes.next();
        });
    }

    changes = new Subject<void>();

    itemsPerPageLabel = this.translate.instant('PAGINATOR.ITEMS_PER_PAGE_LABEL');
    nextPageLabel = this.translate.instant('PAGINATOR.NEXT_PAGE_LABEL');
    previousPageLabel = this.translate.instant('PAGINATOR.PREVIOUS_PAGE_LABEL');
    firstPageLabel = this.translate.instant('PAGINATOR.FIRST_PAGE_LABEL');
    lastPageLabel = this.translate.instant('PAGINATOR.LAST_PAGE_LABEL');

    

    getRangeLabel(page: number, pageSize: number, length: number): string {
        if (length === 0) {
            return `${this.translate.instant('PAGINATOR.PAGE')} 1 ${this.translate.instant('PAGINATOR.OF')} 1`;
        }
        const amountPages = Math.ceil(length / pageSize);
        return `${this.translate.instant('PAGINATOR.PAGE')} ${page + 1} ${this.translate.instant('PAGINATOR.OF')} ${amountPages}`;
    }
}
