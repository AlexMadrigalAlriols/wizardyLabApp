import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import flatpickr from 'flatpickr';
import * as $ from 'jquery';
import Swal from 'sweetalert2';
import 'select2';
import { FrameworkService } from '../-services/framework.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.page.html',
  styleUrls: ['./create-task.page.scss'],
})
export class CreateTaskPage implements AfterViewInit {
  @ViewChild('projectSelect') projectSelect?: ElementRef;
  @ViewChild('userSelect') userSelect?: ElementRef;
  @ViewChild('departmentSelect') departmentSelect?: ElementRef;
  @ViewChild('taskSelect') taskSelect?: ElementRef;
  @ViewChild('statusSelect') statusSelect?: ElementRef;
  @ViewChild('tagsSelect') tagsSelect?: ElementRef;
  isEditing: boolean = false;

  user: any;

  projects: any = [];
  users: any = [];
  selectedUsers: any = [];
  departments: any = [];
  tasks: any = [];
  statuses: any = [];
  selectedStatus: any;
  tags: any = [];
  priorities: any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private framework: FrameworkService,
    private loadingController: LoadingController
  ) {
    let user = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.user = user;
    this.isEditing = this.route.snapshot.paramMap.get('id') ? true : false;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    flatpickr("#start_date", {
      dateFormat: "Y-m-d",
      altInput: true,
      altFormat: "d/m/Y",
      allowInput: true
    });
    flatpickr("#due_date", {
      dateFormat: "Y-m-d",
      altInput: true,
      altFormat: "d/m/Y",
      allowInput: true
    });
    $(this.userSelect?.nativeElement).select2();
    $(this.projectSelect?.nativeElement).select2();
    $(this.departmentSelect?.nativeElement).select2();
    $(this.taskSelect?.nativeElement).select2();
    $(this.statusSelect?.nativeElement).select2();
    $(this.tagsSelect?.nativeElement).select2();
    this.getData(this.loadingController.create());
  }

  goBack() {
    this.router.navigate(['/tabs/tasks'], {onSameUrlNavigation : 'reload'});
  }

  async getData(loading: Promise<HTMLIonLoadingElement>) {
    await this.framework.get('getData', {}, true).subscribe((data: any) => {
      this.projects = data.projects;
      this.users = data.users;
      this.departments = data.departments;
      this.tasks = data.tasks;
      this.statuses = data.statuses;
      this.selectedStatus = data.statuses[0].id;
      this.tags = data.tags;
      this.priorities = data.priorities;
      this.priorities = [{id: data.priorities.low}, {id: data.priorities.medium}, {id: data.priorities.high}];

      loading.then(loadingElement => {
        loadingElement.dismiss();
      });
    });
  }

  async onSubmit(form: NgForm) {
    const loading = this.loadingController.create();
    loading.then(loadingElement => {
      loadingElement.present();
    });

    const status = $('#status').val();
    const priority = $('#priority').val();
    const tags = $('#tags').val();
    const assigned_users = $('#assigned_users').val();
    const departments = $('#departments').val();
    const project = $('#project').val();
    const parent_task = $('#parent_task').val();

    if(form.value.title === '' || status === '' || priority == '') {
      Swal.fire({
        toast: true,
        title: 'Please fill all required fields',
        icon: 'error',
        showConfirmButton: false,
        position: 'top-end',
        timer: 3000,
      });

      loading.then(loadingElement => {
        loadingElement.dismiss();
      });
      return;
    }

    const formData = { ...form.value, status, assigned_users, departments, project, parent_task, tags, priority};
    await this.framework.post('tasks', formData, true).subscribe((data: any) => {
      Swal.fire({
        toast: true,
        title: 'Task Created',
        icon: 'success',
        showConfirmButton: false,
        position: 'top-end',
        timer: 3000,
      });
      loading.then(loadingElement => {
        loadingElement.dismiss();
      });

      this.router.navigate(['/tabs/tasks']);
    },
    error => {
      Swal.fire({
        toast: true,
        title: error.message,
        icon: 'error',
        showConfirmButton: false,
        position: 'top-end',
        timer: 3000,
      });

      loading.then(loadingElement => {
        loadingElement.dismiss();
      });
    });
  }
}
