import { Component } from '@angular/core';
import { FormatListPipe } from './pipes/format-list.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, FormatListPipe, TimeAgoPipe],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    // Example for pure pipe
    items: string[] = ['Maçã', 'Banana', 'Laranja'];

    // Example for impure pipe
    postDate = new Date(new Date().getTime() - 3600000); // 1 hour ago
    commentDate = new Date(new Date().getTime() - 300000); // 5 minutes ago

    addItem() {
        this.items.push('Morango');
    }

    updatePost() {
        this.postDate = new Date();
    }
}
