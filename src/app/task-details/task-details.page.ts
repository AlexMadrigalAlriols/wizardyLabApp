import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.page.html',
  styleUrls: ['./task-details.page.scss'],
})
export class TaskDetailsPage implements OnInit {
  taskId: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id');
    console.log('ID de la tarea:', this.taskId);
  }

}
