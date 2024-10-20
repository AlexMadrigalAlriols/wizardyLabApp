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
