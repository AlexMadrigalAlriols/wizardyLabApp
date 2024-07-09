// tasks.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FrameworkService } from './framework.service';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private framework: FrameworkService) { }

  getTasks() {
    const tasksData = this.framework.get('tasks', {}, true).subscribe((response: any) => {
      return JSON.stringify(response);
    });

    return tasksData;
  }
}
