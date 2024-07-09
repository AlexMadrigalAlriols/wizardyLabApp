import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private seconds = 0;
  private timerSubscription?: Subscription;
  private timerSubject = new BehaviorSubject<string>('00:00:00');

  constructor() { }

  startTimer(timer: string) {
    const timeParts = timer.split(':');
    this.seconds = (+timeParts[0]) * 3600 + (+timeParts[1]) * 60 + (+timeParts[2]);

    this.timerSubscription = interval(1000).subscribe(() => {
      this.seconds++;
      const hours = Math.floor(this.seconds / 3600);
      const minutes = Math.floor((this.seconds % 3600) / 60);
      const secs = this.seconds % 60;
      const formattedTime = this.formatTime(hours, minutes, secs);
      this.timerSubject.next(formattedTime);
    });
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  getCurrentTime() {
    return this.timerSubject.asObservable();
  }

  private formatTime(hours: number, minutes: number, seconds: number): string {
    const paddedHours = this.pad(hours);
    const paddedMinutes = this.pad(minutes);
    const paddedSeconds = this.pad(seconds);
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  }

  private pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
