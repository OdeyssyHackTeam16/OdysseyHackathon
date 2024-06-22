// adviser.component.ts
import { Component, OnInit } from '@angular/core';
import { IpfsService } from '../ipfs.service';

interface AdviceMessage {
  message: string;
  timestamp: string;
}

@Component({
  selector: 'app-adviser',
  templateUrl: './adviser.component.html',
  styleUrls: ['./adviser.component.css']
})
export class AdviserComponent implements OnInit {

  public advice: AdviceMessage[] = [];

  constructor(private ipfsService: IpfsService) { }

  async ngOnInit() {
    const lastWeek = this.getLastWeekDates();
    const initialData = await this.ipfsService.getFilesByDateRange(lastWeek.monday, lastWeek.sunday);
    this.generateAdvice(initialData);
  }

  getLastWeekDates() {
    const today = new Date();
    const lastSunday = new Date(today.setDate(today.getDate() - today.getDay()));
    const lastMonday = new Date(lastSunday);
    lastMonday.setDate(lastSunday.getDate() - 6);

    return {
      monday: new Date(lastMonday),
      sunday: new Date(lastSunday)
    };
  }

  formatToDateInput(date: Date) {
    return date.toISOString().split('T')[0];
  }

  generateAdvice(data: any[]): void {
    const weekdayData = data.filter(day => !this.isWeekend(day.date));
    const weekendData = data.filter(day => this.isWeekend(day.date));

    const weekdayLightingAdvice = this.checkLightingUsage(weekdayData, false);
    const weekendLightingAdvice = this.checkLightingUsage(weekendData, true);

    const weekdayComputerAdvice = this.checkComputerUsage(weekdayData, false);
    const weekendComputerAdvice = this.checkComputerUsage(weekendData, true);

    this.advice.push(...weekdayLightingAdvice, ...weekendLightingAdvice, ...weekdayComputerAdvice, ...weekendComputerAdvice);

    if (this.advice.length === 0) {
      this.advice.push({ message: 'Your recent energy usage is optimal. Keep up the good work!', timestamp: '' });
    }
  }

  checkLightingUsage(data: any[], isWeekend: boolean): AdviceMessage[] {
    const adviceMessages: AdviceMessage[] = [];

    data.forEach(day => {
      const hours = day.consumptionPerHour['lighting'] || [];
      for (let i = 18; i < 24; i++) { // Check from 6 PM to midnight
        if (hours[i] > 0) {
          const timestamp = new Date(day.date).toLocaleString();
          const message = `Consider reducing lighting usage during evening hours ${isWeekend ? 'on weekends' : 'on weekdays'} to save energy. Detected on ${timestamp}.`;
          adviceMessages.push({ message, timestamp });
          break; // No need to check further if excessive usage is found
        }
      }
    });

    return adviceMessages;
  }

  checkComputerUsage(data: any[], isWeekend: boolean): AdviceMessage[] {
    const adviceMessages: AdviceMessage[] = [];

    data.forEach(day => {
      const hours = day.consumptionPerHour['computer'] || [];
      if (hours.some((hour: number) => hour > 0)) {
        const timestamp = new Date(day.date).toLocaleString();
        const message = `Avoid prolonged computer usage ${isWeekend ? 'during weekends' : 'during weekdays'} to conserve energy. Detected on ${timestamp}.`;
        adviceMessages.push({ message, timestamp });
      }
    });

    return adviceMessages;
  }

  isWeekend(dateString: string): boolean {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 0 || day === 6;
  }
}
