import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { TasksService } from '../-services/tasks.service';
import { FrameworkService } from '../-services/framework.service';
import { LoadingController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, debounce, interval } from 'rxjs';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage {
  tasks: any[] = [];
  statuses: any[] = [];
  pagination: any = {pages: 1, total: 100, take: 10, skip: 10};
  pages: number = 1;
  counters: any;
  isAllPages: boolean = false;
  currentPage: number = 1;
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription | undefined;

  constructor(
    private loadingController: LoadingController,
    private framework: FrameworkService,
    private translateService: TranslateService,
    private router: Router
  ) {
    this.searchSubscription = this.searchSubject.pipe(
      debounce(() => interval(500)) // Tiempo de espera en milisegundos
    ).subscribe(search => {
      const loading = this.loadingController.create();
      this.getTasks(loading, 1, search);
    });
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  async ngOnInit() {
    const loading = this.loadingController.create();
    loading.then(loadingElement => {
      loadingElement.present();
    });

    await this.getTasks(loading);

    document.querySelectorAll('.dropdown-toggle').forEach(dropdownToggleEl => {
      new bootstrap.Dropdown(dropdownToggleEl);
    });
  }

  refresh(event: any) {
    const loading = this.loadingController.create();
    setTimeout(() => {
      this.getTasks(loading);
      event.target.complete();
    }, 1000);
  }

  toggleSubTasks(e: Event, task: any) {
    e.preventDefault();
    const subtasks = document.querySelectorAll(`.subtasks-${task.id}`);
    subtasks.forEach(subtask => subtask.classList.toggle('d-none'));
    task.expanded = task.expanded ? false : true;
  }

  async deleteTask(taskId: number) {
    const loading = this.loadingController.create();
    loading.then(loadingElement => {
      loadingElement.present();
    });

    await this.framework.delete('tasks/' + taskId, {}, true).subscribe((data: any) => {
      this.getTasks(loading);

      Swal.fire({
        toast: true,
        title: 'Task Removed',
        icon: 'success',
        showConfirmButton: false,
        position: 'top-end',
        timer: 3000
      });
    });
  }

  async archiveTask(taskId: number) {
    const loading = this.loadingController.create();
    loading.then(loadingElement => {
      loadingElement.present();
    });

    await this.framework.post('tasks/' + taskId + '/archive', {}, true).subscribe((data: any) => {
      this.getTasks(loading);

      Swal.fire({
        toast: true,
        title: 'Task Archived',
        icon: 'success',
        showConfirmButton: false,
        position: 'top-end',
        timer: 3000
      });
    });
  }

  editTask(taskId: number) {
    this.router.navigate(['/edit-task', taskId]);
  }

  async getTasks(loading: Promise<HTMLIonLoadingElement>, page: number = 1, search: string = '') {
    await this.framework.get('tasks?page=' + page + '&search=' + search, {}, true).subscribe((data: any) => {
      this.tasks = data.tasks;
      this.statuses = data.statuses;
      this.pagination = data.pagination;
      this.counters = data.counters;
      this.isAllPages = data.isAllPages;
      this.pages = this.pagination.pages;

      loading.then(loadingElement => {
        loadingElement.dismiss();
      });
    });
  }

  clockIn(task: any) {
    const loading = this.loadingController.create();
    loading.then(loadingElement => {
      loadingElement.present();
    });

    this.framework.post('tasks/' + task.id + '/clock-in', {}, true).subscribe((response: any) => {
      loading.then(loadingElement => {
        loadingElement.dismiss();
      });
      task.is_clockIn = true;
      Swal.fire({
        toast: true,
        title: this.translateService.instant('clock_in_success'),
        icon: 'success',
        showConfirmButton: false,
        position: 'top-end',
        timer: 3000
      });
    },
    error => {
      loading.then(loadingElement => {
        loadingElement.dismiss();
      });

      Swal.fire({
        toast: true,
        title: this.translateService.instant('errors.clock_in'),
        icon: 'error',
        showConfirmButton: false,
        position: 'top-end',
        timer: 3000,
      });
    });
  }

  clockOut(task: any) {
    const loading = this.loadingController.create();
    loading.then(loadingElement => {
      loadingElement.present();
    });

    this.framework.post('tasks/' + task.id + '/clock-out', {}, true).subscribe((response: any) => {
      loading.then(loadingElement => {
        loadingElement.dismiss();
      });
      task.is_clockIn = false;

      Swal.fire({
        toast: true,
        title: this.translateService.instant('clock_out_success'),
        icon: 'success',
        showConfirmButton: false,
        position: 'top-end',
        timer: 3000
      });
    },
    error => {
      loading.then(loadingElement => {
        loadingElement.dismiss();
      });

      Swal.fire({
        toast: true,
        title: this.translateService.instant('errors.clock_out'),
        icon: 'error',
        showConfirmButton: false,
        position: 'top-end',
        timer: 3000,
      });
    });
  }

  changeStatus(task: any, status: any) {
    const loading = this.loadingController.create();
    loading.then(loadingElement => {
      loadingElement.present();
    });

    this.framework.post('tasks/' + task.id + '/update-status/' + status.id, {}, true).subscribe((response: any) => {
      loading.then(loadingElement => {
        loadingElement.dismiss();
      });
      task.status = status;

      Swal.fire({
        toast: true,
        title: this.translateService.instant('status_updated'),
        icon: 'success',
        showConfirmButton: false,
        position: 'top-end',
        timer: 3000
      });
    },
    error => {
      loading.then(loadingElement => {
        loadingElement.dismiss();
      });

      Swal.fire({
        toast: true,
        title: this.translateService.instant('errors.status'),
        icon: 'error',
        showConfirmButton: false,
        position: 'top-end',
        timer: 3000,
      });
    });
  }

  searchTasks(event: any) {
    const searchTerm = event.target.value.trim();
    this.searchSubject.next(searchTerm);
  }

  async changePage(page: number) {
    const loading = this.loadingController.create();
    loading.then(loadingElement => {
      loadingElement.present();
    });
    this.currentPage = page;
    await this.getTasks(loading, page);
  }

  goToTaskDetail(taskId: string) {
    this.router.navigate(['/tabs/task', taskId]);
  }

  createTask() {
    this.router.navigate(['/create-task']);
  }

  range(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }
}
