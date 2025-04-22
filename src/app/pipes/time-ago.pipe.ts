import {
    Pipe,
    PipeTransform,
    ChangeDetectorRef,
    OnDestroy,
} from '@angular/core';

@Pipe({
    name: 'timeAgo',
    pure: false,
    standalone: true,
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
    private timer: any;
    private lastValue: Date | null = null;
    private lastText = '';

    constructor(private ref: ChangeDetectorRef) {}

    transform(value: Date): string {
        if (!value) {
            return '';
        }

        if (
            this.lastValue === null ||
            this.lastValue.getTime() !== value.getTime()
        ) {
            this.lastValue = value;
            this.clearTimer();
        }

        if (!this.timer) {
            this.timer = setInterval(() => {
                this.ref.markForCheck();
            }, 1000); // Update every second
        }

        this.lastText = this.calculateTimeAgo(value);
        return this.lastText;
    }

    ngOnDestroy() {
        this.clearTimer();
    }

    private clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    private calculateTimeAgo(date: Date): string {
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) {
            return 'agora mesmo';
        } else if (minutes < 60) {
            return `há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
        } else if (hours < 24) {
            return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
        } else {
            return `há ${days} ${days === 1 ? 'dia' : 'dias'}`;
        }
    }
}
