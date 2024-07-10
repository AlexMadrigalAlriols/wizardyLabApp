import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'attendance',
        loadChildren: () => import('../attendance/attendance.module').then(m => m.AttendancePageModule)
      },
      {
        path: 'tasks',
        loadChildren: () => import('../tasks/tasks.module').then(m => m.TasksPageModule)
      },
      {
        path: 'task/:id',
        loadChildren: () => import('../task-details/task-details.module').then(m => m.TaskDetailsPageModule)
      },
      {
        path: 'create-task',
        loadChildren: () => import('../create-task/create-task.module').then(m => m.CreateTaskPageModule)
      },
      {
        path: 'edit-task/:id',
        loadChildren: () => import('../create-task/create-task.module').then(m => m.CreateTaskPageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/attendance',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/attendance',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
