import { Component } from '@angular/core';
import { FormatListPipe } from './pipes/format-list.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';

@Component({
    selector: 'app-root',
    imports: [FormatListPipe, TimeAgoPipe],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    items: string[] = ['maçã', 'banana', 'laranja'];

    postDate = new Date(new Date().getTime() - 3600000); // 1 hora atrás
    commentDate = new Date(new Date().getTime() - 300000); // 5 minutos atrás

    addItem() {
        this.items.push('morango');
    }

    updatePost() {
        this.postDate = new Date();
    }
}
