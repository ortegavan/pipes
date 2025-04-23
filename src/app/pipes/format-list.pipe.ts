import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatList',
})
export class FormatListPipe implements PipeTransform {
    transform(items: string[]): string {
        if (!items || items.length === 0) {
            return '';
        }

        if (items.length === 1) {
            return items[0];
        }

        if (items.length === 2) {
            return `${items[0]} e ${items[1]}`;
        }

        const lastItem = items[items.length - 1];
        const otherItems = items.slice(0, -1);
        return `${otherItems.join(', ')} e ${lastItem}`;
    }
}
