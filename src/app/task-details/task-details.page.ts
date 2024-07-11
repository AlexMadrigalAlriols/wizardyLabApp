import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FrameworkService } from '../-services/framework.service';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { TimerService } from '../-services/timer.service';
import { Subscription } from 'rxjs';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.page.html',
  styleUrls: ['./task-details.page.scss'],
})
export class TaskDetailsPage implements OnInit {
  taskId: string | null = null;
  task: any = {};
  timer: string = '00:00:00';
  timerSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private framework: FrameworkService,
    private loadingController: LoadingController,
    private translateService: TranslateService,
    private timerService: TimerService
  ) { }

  async ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id');
    const loading = this.loadingController.create();
    loading.then(loadingElement => {
      loadingElement.present();
    });
    await this.getTask(loading);

    document.querySelectorAll('.dropdown-toggle').forEach(dropdownToggleEl => {
      new bootstrap.Dropdown(dropdownToggleEl);
    });
  }

  async getTask(loading: Promise<HTMLIonLoadingElement>) {
    await this.framework.get('tasks/' + this.taskId, {}, true).subscribe((data: any) => {
      this.task = data;
      this.timer = this.task.timer;

      if(this.task.is_clockIn) {
        this.timerService.startTimer(this.timer);
        this.timerSubscription = this.timerService.getCurrentTime().subscribe(time => {
          this.timer = time;
        });
      }

      loading.then(loadingElement => {
        loadingElement.dismiss();
      });
    });
  }

  goBack() {
    this.router.navigate(['/tabs/tasks']);
  }

  async submitComment(form: NgForm) {
    const comment = form.value.comment;
    if(comment != '') {
      const loading = this.loadingController.create();
      loading.then(loadingElement => {
        loadingElement.present();
      });


      await this.framework.post('tasks/' + this.taskId + '/comment', {comment}, true).subscribe((data: any) => {
        this.getTask(loading);

        Swal.fire({
          toast: true,
          title: 'Comment Success',
          icon: 'success',
          showConfirmButton: false,
          position: 'top-end',
          timer: 3000
        });
      });
    }
  }

  async removeComment(commentId: any) {
    const loading = this.loadingController.create();
    loading.then(loadingElement => {
      loadingElement.present();
    });

    await this.framework.delete('tasks/' + this.taskId + '/comment/' + commentId, {}, true).subscribe((data: any) => {
      this.getTask(loading);

      Swal.fire({
        toast: true,
        title: 'Comment Removed',
        icon: 'success',
        showConfirmButton: false,
        position: 'top-end',
        timer: 3000
      });
    });
  }

  async removeImage(imageId: any) {
    const loading = this.loadingController.create();
    loading.then(loadingElement => {
      loadingElement.present();
    });

    await this.framework.delete('tasks/' + this.taskId + '/image/' + imageId, {}, true).subscribe((data: any) => {
      this.getTask(loading);

      Swal.fire({
        toast: true,
        title: 'Image Removed',
        icon: 'success',
        showConfirmButton: false,
        position: 'top-end',
        timer: 3000
      });
    });
  }

  refresh(event: any) {
    setTimeout(() => {
      this.getTask(new Promise<HTMLIonLoadingElement>((resolve, reject) => {}));

      event.target.complete();
    }, 1000);
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
      this.timerService.startTimer(this.timer);
      this.timerSubscription = this.timerService.getCurrentTime().subscribe(time => {
        this.timer = time;
      });

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
      this.timerService.stopTimer();
      this.timerSubscription?.unsubscribe();

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
}
